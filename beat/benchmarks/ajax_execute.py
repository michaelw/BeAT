from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.template import RequestContext, loader
from django.shortcuts import render_to_response
from beat.benchmarks.models import *
from django.core import serializers
from beat.benchmarks.filter import *
from datetime import datetime
import json
"""
	Function to filter the benchmark table, returns a HttpResponse with the filtered values and the possible algorithms, models, options, and tools
"""
def ajaxbenchmarks(request):
	print "POST:"
	print request.POST.lists()
	
	qs = Benchmark.objects.all()
	result = {}
	benchmarks = []
	algorithmids = []
	optionids = []
	toolids = []
	modelids = []
	
	for benchmark in qs:
		benchmarks.append({
			'id': benchmark.id,
			'model': benchmark.model.name+":"+benchmark.model.version,
			'states': benchmark.states_count,
			'runtime': benchmark.total_time,
			'memory': benchmark.memory_RSS,
			'finished': benchmark.finished
		})
		#add ids
		#algorithmids.append(benchmark.algorithm.id)
		#toolids.append(benchmark.tool.id)
		#modelids.append(benchmark.model.id)
		#for ov in benchmark.optionvalue.all():
			#optionids.append(ov.option.id)
	
	result['benchmarks'] = benchmarks
	#algorithms = []
	#options = []
	#tools = []
	#models = []
	
	#for a in Algorithm.objects.filter(id__in=algorithmids).order_by('name').values('id','name'):
		#algorithms.append(a)
	#for m in Model.objects.filter(id__in=modelids).order_by('name').values('id','name'):
		#models.append(m)
	#for o in Option.objects.filter(id__in=optionids).order_by('name').values('id','name','takes_argument'):
		#options.append(o)
	#for t in Tool.objects.filter(id__in=toolids).order_by('name').values('id','name'):
		#tools.append(t)
	
	#result['algorithms'] = algorithms
	#result['options'] = options
	#result['tools'] = tools
	#result['models'] = models
	"""
	#qs = filter(Benchmark.objects.all(),convertfilters(request.POST.lists()))
	qs = Benchmarks.objects.all()
	#filters = convertfilters(request.POST.lists())
	#for f in filters:
		#if f.type in LISTFILTERS:
			#ids = []
			#for benchmark in qs:
				#ids.append(benchmark.)
			#print f.type
		#qs = f.apply(qs)
	order = 'id'; #needs code to get the actual order
	qs.order_by(order)
	
	result = {}
	benchmarks = []
	algorithmids = []
	optionids = []
	toolids = []
	modelids = []
	
	for benchmark in qs:
		benchmarks.append({
			'id': benchmark.id,
			'model': benchmark.model.name+":"+benchmark.model.version,
			'states': benchmark.states_count,
			'runtime': benchmark.total_time,
			'memory': benchmark.memory_RSS,
			'finished': benchmark.finished
		})
		#add ids
		algorithmids.append(benchmark.algorithm.id)
		toolids.append(benchmark.tool.id)
		modelids.append(benchmark.model.id)
		for ov in benchmark.optionvalue.all():
			optionids.append(ov.option.id)
	
	result['benchmarks'] = benchmarks
	algorithms = []
	options = []
	tools = []
	models = []
	
	for a in Algorithm.objects.filter(id__in=algorithmids).order_by('name').values('id','name'):
		algorithms.append(a)
	for m in Model.objects.filter(id__in=modelids).order_by('name').values('id','name'):
		models.append(m)
	for o in Option.objects.filter(id__in=optionids).order_by('name').values('id','name','takes_argument'):
		options.append(o)
	for t in Tool.objects.filter(id__in=toolids).order_by('name').values('id','name'):
		tools.append(t)
	
	result['algorithms'] = algorithms
	result['options'] = options
	result['tools'] = tools
	result['models'] = models
	"""
	dump = json.dumps(result)
	print '--------------DUMP-------------------'
	print dump
	
	return HttpResponse(dump,mimetype="application/json")