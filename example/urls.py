from django.urls import path
from example import views

urlpatterns = [
    path("", views.home, name='home'),
    path('projects/', views.projects, name='projects'),  # Projects view
    path('about/', views.about, name='about'),  # About view
    path('cv/', views.cv, name='cv'),
    path('2019_election/', views.alegeri, name='alegeri'),
    path('unemployment/', views.unemployment, name='unemployment'),
    path('votes/', views.vote_list, name='vote_list'),
    path('county-votes/', views.county_votes, name='county_votes'),
      path('vote/', views.vote, name='vote'),
]
