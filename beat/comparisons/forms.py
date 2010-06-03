from django import forms
from django.forms import widgets
from django.db.models import Count

from beat.benchmarks.models import Benchmark, Model, Algorithm, Tool, OptionValue, AlgorithmTool
from beat.comparisons.models import *

class ExportGraphForm(forms.Form):
	FORMATS = (
		# ('value', 'description')
		('pdf', 'pdf'),
		('ps', 'ps'),
		('eps', 'eps'),
		('svg', 'svg'),
	)
	format  = forms.ChoiceField(choices=FORMATS, label='Export format')

class CompareForm(forms.Form):
	benchmarks = forms.ModelMultipleChoiceField(Benchmark.objects.all(), required=False, widget=widgets.CheckboxSelectMultiple)
	name = forms.CharField(max_length=255, required=False)

class CompareScatterplotForm(forms.Form):
	algo 				= AlgorithmTool.objects.all()
	
	name 				= forms.CharField(max_length=255, required=False)
	a_algo 				= forms.ModelChoiceField(Algorithm.objects.all())
	a_tool 				= forms.ModelChoiceField(Tool.objects.all())
	a_version 			= forms.ChoiceField(choices=[(v,v) for v in [at['version'] for at in AlgorithmTool.objects.values('version').distinct()]])
	
	
	a_algorithmtool 	= forms.ModelChoiceField(algo, label="AlgorithmTool A")
	b_algorithmtool		= forms.ModelChoiceField(algo, label="AlgorithmTool B")
	
	
class CompareModelsForm(forms.Form):
	name = forms.CharField(max_length=255, required=False, help_text='A name for your comparison')
	type = forms.ChoiceField(choices=ModelComparison.DATA_TYPES, label='Data type', help_text='What type of data should be displayed in the graph?')
	tool = forms.ModelChoiceField(Tool.objects.all(), empty_label=None)
	algorithm = forms.ModelChoiceField(Algorithm.objects.all(), empty_label=None)
	option = forms.ModelChoiceField(OptionValue.objects.all(), required=False)
	#models = forms.ModelMultipleChoiceField(Model.objects.all())