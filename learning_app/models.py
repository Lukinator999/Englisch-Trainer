from django.db import models
# Modell für Texte
class newText(models.Model):
	title = models.CharField(max_length=50)
	english_text = models.TextField(max_length=10000)
	date = models.DateField(auto_now_add=True, blank=True)
	german_text = models.TextField(max_length=15000, blank=True)
	length = models.IntegerField(blank=True, default=0)
	read = models.BooleanField(blank=True, default=False)
	def __str__(self):
		return self.title

# Modell für Vokabeln
class newVocabulary(models.Model):
	german_word = models.CharField(max_length=50, blank=True, null=True)
	english_word = models.CharField(max_length=50, blank=True, null=True)