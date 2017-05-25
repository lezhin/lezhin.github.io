---
layout: page
title: Authors
permalink: /authors/
sitemap: true
---
{% for author in site.authors %}
* [{{ author.name }}]({{ site.baseurl }}/authors/{{ author.name }})
{% endfor %}
