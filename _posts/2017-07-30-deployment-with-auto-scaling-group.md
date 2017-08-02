---
title: 'Auto Scalinging Group 을 이용한 배포'
author: cypher
date: 2017-07-30
tag: [backend,cloud,aws]
---

레진코믹스의 서버 시스템은 잘 알려진대로 Google AppEngine 위에서 서비스되고 있지만, 이런저런 이유로 인해 최근에는 일부 컴포넌트가 Amazon Web Service 에서 서비스되고 있습니다. AWS쪽에 새로운 시스템을 셋업하면서, 기존에 사용하던 PaaS인 GAE에서는 전혀 고민할 필요 없었던, 배포시스템에 대한 고민이 필요했습니다. 좋은 배포전략과 시스템은 안정적으로 서비스를 개발하고 운영하는데 있어서 필수적이죠.

초기에는 ​Beanstalk 을 이용한 운영에서, Fabric 을 ​이용한 배포 등의 시행착오 과정을 거쳤으나, 현재는 (스케일링을 위해 어차피 사용할 수밖에 없는) Auto Scaling Group을 이용해서 Blue-green deployment 로 운영중입니다. ASG는 여러 특징 덕분에 배포에도 유용하게 사용할 수 있습니다.

ASG를 이용한 가장 간단한 배포는, Instance termination policy 를 응용할 수 있습니다. 기본적으로 ASG가 어떤 인스턴스를 종료할지는 [AWS Documentation](http://docs.aws.amazon.com/autoscaling/latest/userguide/as-instance-termination.html) 에 정리되어 있으며, 추가적으로 다음과 같은 방식을 선택할 수 있습니다.

* OldestInstance
* NewestInstance
* OldestLaunchConfiguration
* ClosestToNextInstanceHour

여기서 주목할건 OldestInstance 입니다. ASG가 항상 최신 버전의 어플리케이션으로 스케일아웃되게 구성되어 있다면, 단순히 인스턴스의 수를 두배로 늘린 뒤 Termination policy 를 OldestInstance 로 바꾸고 원래대로 돌리면 구버전 인스턴스들부터 종료되면서 배포가 끝납니다. 그러나 이 경우, 배포 직후 모니터링 과정에서 문제가 발생할 경우 기존의 인스턴스들이 이미 종료된 상태이기 때문에 롤백을 위해서는 (인스턴스를 다시 생성하면서) 배포를 다시 한번 해야 하는 반큼 빠른 롤백이 어렵습니다.

[Auto scaling lifecycle](http://docs.aws.amazon.com/autoscaling/latest/userguide/AutoScalingGroupLifecycle.html) 을 이용하면, 이를 해결하기 위한 다른 방법도 있습니다. Lifecycle 은 다음과 같은 상태 변화를 가집니다.

![Auto scaling lifecycle](http://docs.aws.amazon.com/autoscaling/latest/userguide/images/auto_scaling_lifecycle.png)

기본적으로,

* ASG의 인스턴스는 InService 상태로 진입하면서 (설정이 되어 있다면) ELB에 ​추가됩니다.
* ASG의 인스턴스는 InService 상태에서 빠져나오면서 (설정이 되어 있다면) ELB에서 제거됩니다.

이를 이용하면, 다음과 같은 시나리오로 배포를 할 수 있습니다.

* 똑같은 ASG 두 개를 구성(Group B / Group G)하고, 그 중 하나의 그룹으로만 서비스를 운영합니다.  
  Group B가 라이브중이면 Group G의 인스턴스는 0개입니다.
* 새로운 버전을 배포한다면, Group G의 인스턴스 숫자를 Group B와 동일하게 맞춰줍니다.
* Group G가 InService 로 들어가고 ELB healthy 상태가 되면, Group B의 인스턴스를 전부 Standby 로 전환합니다.
  * 롤백이 필요하면 Standby 상태인 Group B를 ​InService 로 전환하고 Group G의 인스턴스를 종료하거나 Standby 로 전환합니다.
  * 문제가 없다면 Standby 상태인 Group B의 인스턴스를 종료합니다.

이제 훨씬 빠르고 안전하게 배포 및 롤백이 가능합니다. 물론 실제로는 생각보다 손이 많이 가는 관계로(특히 PaaS인 GAE에 비하면), 이를 한번에 해주는 스크립트를 작성해서 사용중입니다. 대략 간략하게는 다음과 같습니다. 실제 사용중인 스크립트에는 dry run 등의 잡다한 기능이 많이 들어가 있어서 걷어낸 pseudo code 입니다. 스크립트는 사내 PyPI 저장소를 통해 공유해서 사용중입니다.

    def deploy(prefix, image_name, image_version):
        '''Deploy specified Docker image name and version into Auto Scaling Group'''
        asg_names = get_asg_names_from_tag(prefix, 'docker:image:name', image_name)
        groups = get_auto_scaling_groups(asg_names)

        # Find deployment target set
        future_set = set(map(lambda g: g['AutoScalingGroupName'].split('-')[-1], filter(lambda g: not g['DesiredCapacity'], groups)))
        if len(future_set) != 1:
            raise ValueError('Cannot specify target auto scaling group')
        future_set = next(iter(future_set))
        if future_set == 'green':
            current_set = 'blue'
        elif future_set == 'blue':
            current_set = 'green'
        else:
            raise ValueError('Set name shoud be green or blue')

        # Deploy to future group
        future_groups = filter(lambda g: g['AutoScalingGroupName'].endswith(future_set), groups)
        for group in future_groups:
            asg_client.create_or_update_tags(Tags=[
                {
                    'ResourceId': group['AutoScalingGroupName'],
                    'ResourceType': 'auto-scaling-group',
                    'PropagateAtLaunch': True,
                    'Key': 'docker:image:version',
                    'Value': image_version,
                }
            ])
            # Set capacity, scaling policy, scheduled actions same as current group
            set_desired_capacity_from(current_set, group)
            move_scheduled_actions_from(current_set, group)
            move_scaling_policies(current_set, group)

        # Await ELB healthy of instances in group
        await_elb_healthy(future_groups)

        # Entering standby for current group
        for group in filter(lambda g: g['AutoScalingGroupName'].endswith(current_set), groups):
            asg_client.enter_standby(
                AutoScalingGroupName=group['AutoScalingGroupName'],
                InstanceIds=list(map(lambda i: i['InstanceId'], group['Instances'])),
                ShouldDecrementDesiredCapacity=True
            )

    def rollback(prefix, image_name, image_version):
        '''Rollback standby Auto Scaling Group to service'''
        asg_names = get_asg_names_from_tag(prefix, 'docker:image:name', image_name)
        groups = get_auto_scaling_groups(asg_names)

        def filter_group_by_instance_state(groups, state):
            return filter(
                lambda g: len(filter(lambda i: i['LifecycleState'] == state, g['Instances'])) == g['DesiredCapacity'] and g['DesiredCapacity'],
                groups
            )

        standby_groups = filter_group_by_instance_state(groups, 'Standby')
        inservice_groups = filter_group_by_instance_state(groups, 'InService')

        # Entering in-service for standby group
        for group in standby_groups:
            asg_client.exit_standby(
                AutoScalingGroupName=group['AutoScalingGroupName'],
                InstanceIds=list(map(lambda i: i['InstanceId'], group['Instances']))
            )

        # Await ELB healthy of instances in standby group
        await_elb_healthy(standby_groups)

        # Terminate instances to rollback
        for group in inservice_groups:
            asg_client.set_desired_capacity(AutoScalingGroupName=group['AutoScalingGroupName'], DesiredCapacity=0)
            current_set = group['AutoScalingGroupName'].split('-')[-1]
            move_scheduled_actions_from(current_set, group)
            move_scaling_policies(current_set, group)

몇 가지 더.

1. Standby 로 돌리는 것 이외에 ​Detached 상태로 바꾸는 것도 방법입니다만, ​인스턴스가 ASG에서 제거될 경우, 자신이 소속된 ASG를 알려주는 값인 aws:autoscaling:groupName 태그가 제거되므로 인스턴스나 ASG가 많아질 경우 번거롭습니다.
2. cloud-init 를 어느정도 최적화해두고 ELB healthcheck 를 좀 더 민감하게 설정하면,  ELB 에 투입될때까지 걸리는 시간을 상당히 줄일 수 있긴 하므로, 단일 ASG로 배포를 하더라도 롤백에 걸리는 시간을 줄일 수 있습니다. 저희는 scaleout 시작부터 ELB에서 healthy 로 찍힐 때까지 70초가량 걸리는데, 그럼에도 불구하고 아래의 이유 때문에 현재의 방식으로 운영중입니다.
3. 같은 방식으로 단일 ASG로 배포를 할 수도 있지만, 배포중에 혹은 롤백중에 Scaleout이 돌면서 구버전 혹은 롤백버전의 인스턴스가 투입되어버리면 매우 귀찮아집니다. 이를 방지하기 위해서라도 (Blue-green 방식의) ASG 두 개를 운영하는게 안전합니다.
  * 같은 이유로, 배포 대상의 버전을 S3나 github 등에 기록하는 대신 ASG의 태그에 버전을 써 두고 cloud-init 의 user-data에서 그 버전으로 어플리케이션을 띄우게 구성해 두었습니다. 이 경우 인스턴스의 태그만 확인해도 현재 어떤 버전이 서비스되고 있는지 확인할 수 있다는 장점도 있습니다.
  * 다만 ASG의 태그에 Tag on instance 를 체크해두더라도, cloud-init 안에서 이를 조회하는 ​경우는 주의해야 합니다. ASG의 태그가 인스턴스로 복사되는 시점은 명확하지 않습니다. 스크립트 실행 중에 인스턴스에는 ASG의 태그가 있을 수도, 없을 수도 있습니다.
4. 굳이 인스턴스의 Lifecycle 을 Standby / InService 로 전환하지 않고도 ELB 를 두 개 운영하고 route 53 에서의 CNAME/ALIAS swap 도 방법이지만, DNS TTL은 아무리 짧아도 60초는 걸리고, JVM처럼 골치아픈 동작 사례도 있는만큼 선택하지 않았습니다.

물론 이 방법이 최선은 절대 아니며(심지어 배포할때마다 돈이 들어갑니다!), 현재는 자원의 활용 등 다른 측면에서의 고민 때문에 새로운 구성을 고민하고 있습니다. 이건 언젠가 나중에 다시 공유하겠습니다. :)
