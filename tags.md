---
layout: page
title: Tags
permalink: /tags/
sitemap: true
---
{% for tag in site.tags %}
* [{{ tag.name }}]({{ site.baseurl }}/tags/{{ tag.name }})
{% endfor %}
