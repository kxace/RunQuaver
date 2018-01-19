"""runquaver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import url, include
from django.contrib.auth import views as auth_views
from quavergame import views

urlpatterns = [
    url(r'^test$', views.test, name='test'),

    url(r'^welcome$', views.welcome, name='welcome'),
    url(r'^$', views.home, name='home'),
    url(r'^index$', views.index, name='index'),

    # Set page
    url(r'^set-cover$', views.set_cover),
    url(r'^set-rank$', views.set_rank),
    url(r'^get-list$', views.get_list),
    url(r'^set-signup$', views.set_signup),

    # Signup
    url(r'^signup$', views.user_signup),
    url(r'^get-map$', views.getmap, name='map'),
    url(r'^set-buttons$', views.set_buttons, name='set-buttons'),

    # Login & logout
    url(r'^login$', views.user_login, name='login'),
    url(r'^logout$', auth_views.logout_then_login, name='logout'),
    url(r'^photo/(?P<username>\w+)$', views.get_photo, name='photo'),

    # Game control
    url(r'^start/(?P<mode>\d+)$', views.start, name='start'),
    url(r'^save$', views.save, name='save'),
    url(r'^resume/(?P<mode>\d+)$', views.resume, name='resume'),
    # url(r'^get-match/(?P<matchid>\w+)', views.replay, name='replay'),

]
