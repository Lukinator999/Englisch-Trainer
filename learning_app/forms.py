from django import forms
from django.forms import ModelForm
from .models import newText

class PostForm(ModelForm):
    class Meta:
        model = newText
        fields = '__all__'
        widgets = {
            'tags':forms.CheckboxSelectMultiple(),
        }