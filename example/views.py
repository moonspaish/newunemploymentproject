from django.shortcuts import render


def home(request):
    return render(request, "example/index.html", {})


def projects(request):
    return render(request, 'example/projects.html')


def about(request):
    return render(request, 'example/about.html')
def unemployment(request):
    return render(request, 'example/unemployment.html')

def cv(request):
    return render(request, 'example/cv.html')
def alegeri(request):
    return render(request, 'example/proiect_alegeri.html')

from collections import Counter
from django.shortcuts import  redirect
from .models import Vote
from .forms import VoteForm
import json

def vote(request):
    # Handle form submission
    if request.method == 'POST':
        form = VoteForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('vote')
    else:
        form = VoteForm()

    # Query the database to get the votes
    votes = Vote.objects.values_list('choice', flat=True)

    # Count the occurrences of each candidate
    candidate_counts = dict(Counter(votes))

    # Format data for D3.js
    plot_data = [{'choice': k, 'votes': v} for k, v in candidate_counts.items()]

    # Render template with form and histogram data
    return render(request, 'example/vote.html', {
        'form': form,
        'plot_data': json.dumps(plot_data)
    })
def vote_list(request):
    votes = Vote.objects.all()
    return render(request, 'example/vote_list.html', {'votes': votes})

from django.http import JsonResponse
from django.db.models import Count

def county_votes(request):
    # Aggregate votes by county and candidate
    votes = Vote.objects.values('county', 'choice').annotate(total_votes=Count('id'))
    
    # Process the data to get the candidate with the most votes in each county
    county_results = {}
    for vote in votes:
        county = vote['county']
        candidate = vote['choice']
        total_votes = vote['total_votes']
        
        if county not in county_results:
            county_results[county] = {}
        
        county_results[county][candidate] = total_votes
    
    # Determine the winning candidate in each county
    results = {}
    for county, candidates in county_results.items():
        winner = max(candidates, key=candidates.get)
        results[county] = winner
    
    return JsonResponse(results)