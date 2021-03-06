from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.template import RequestContext, loader
from django.shortcuts import render_to_response
from beat.benchmarks.models import *
from django.core import serializers
from beat.benchmarks.filter import *
from beat.benchmarks.ajax_benchmarks import *
from datetime import datetime
from decimal import Decimal
import json

"""
Class BenchmarkJSON
Makes certain some types are JSON-compatible
"""
class BenchmarkJSON(json.JSONEncoder):
	def default (self, obj):
		if isinstance(obj,datetime):
			return obj.date().isoformat()
		if isinstance(obj,Decimal):
			return float(obj)
		return json.JSONEncoder.default(self,obj)

"""
Function ajaxbenchmarks
converts the result of ajax_benchmarks.getBenchmarks to json and sends a response to the client
"""
def ajaxbenchmarks(request):
	res = getBenchmarks(request)
	dump = json.dumps(res,cls=BenchmarkJSON)
	return HttpResponse(dump,mimetype="application/json")