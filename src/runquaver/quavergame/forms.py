from django import forms
from quavergame.models import *
from django.contrib.auth.models import User

from django.core.exceptions import ObjectDoesNotExist


class UserLoginForm(forms.Form):
    username = forms.CharField(max_length=20,
                               label='Username',
                               required=True,
                               widget=forms.TextInput(attrs={'placeholder': 'Username',
                                                             'class': 'form-control',
                                                             'type': 'username',
                                                             'id': 'login-un'}))
    password = forms.CharField(max_length=200,
                               label='Password',
                               required=True,
                               widget=forms.PasswordInput(attrs={'placeholder': 'Enter Password',
                                                                 'class': 'form-control',
                                                                 'type': 'password',
                                                                 'id': 'login-pw'}))

    def clean_username(self):
        username = self.cleaned_data.get('username')
        try:
            User.objects.get(username__exact=username)
        except ObjectDoesNotExist:
            raise forms.ValidationError("Username does not exist.")

        return username


class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=20,
                               label='Username',
                               required=True,
                               widget=forms.TextInput(attrs={'placeholder': 'Username',
                                                             'class': 'form-control'}))
    password1 = forms.CharField(max_length=200,
                                label='Password',
                                required=True,
                                widget=forms.PasswordInput(attrs={'placeholder': 'Password',
                                                                  'class': 'form-control'}))
    password2 = forms.CharField(max_length=200,
                                label='Confirm password',
                                required=True,
                                widget=forms.PasswordInput(attrs={'placeholder':
                                                                  'Confirm your password',
                                                                  'class': 'form-control'}))

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username__exact=username):
            raise forms.ValidationError("Username is already taken.")
        return username
