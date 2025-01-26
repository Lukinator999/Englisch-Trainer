from django.shortcuts import render, redirect
from django.http import JsonResponse
from .forms import PostForm
from .models import newText, newVocabulary
from deep_translator import GoogleTranslator
translator = GoogleTranslator(source='auto', target='de')

# Funktion zum Übersetzen von Texten
def translate():
    n = newText.objects.last()
    n.german_text = translator.translate(text=n.english_text)
    n.save()

# Funktion zum Zählen der Wörter
def count(item):
    n = item
    n.length = len(n.english_text.split())
    n.save()

# Funktion zum Verarbeiten der Server Anfragen
def create(request):
    form = PostForm()
    posts = newText.objects.all()
    vocabulary = newVocabulary.objects.all()
    # Bei Wortübersetzung
    if request.method == 'POST' and request.POST.get('is_translation_request', None):
        data = request.POST
        word = data.get('word', '')
        translation = translator.translate(word.lower())
        return JsonResponse({'translation': translation})
    # Bei neuem Vokabel aus Text
    elif request.method == 'POST' and request.POST.get('is_vocabulary_request', None):
        data = request.POST
        neuer_eintrag = newVocabulary(german_word=data['germanWord'], english_word=data['englishWord'])
        neuer_eintrag.save()
    # Bei bearbeitetem Text
    elif request.method == 'POST' and request.POST.get('is_edited_text', None):
        try:
            text = newText.objects.get(id=request.POST.get('idPost'))
            text.english_text = request.POST.get('english_text')
            text.german_text = request.POST.get('german_text')
            text.save()
            count(text)
        except: 
            pass
        return redirect('home')
    # Bei gelöschtem Text
    elif request.method == 'POST' and request.POST.get('is_delete_text', None):
        try:
            text = newText.objects.get(id=request.POST.get('idePost'))
            text.delete()
        except:
            pass
        return redirect('home')
    # Bei abgeschlossenem Text
    elif request.method == 'POST' and request.POST.get('is_finished_request', None):
        try:
            text = newText.objects.get(id=request.POST.get('idp'))
            read = request.POST.get('sample')
            if read == 'true':
                text.read = True
            elif read == 'false':
                text.read = False
            text.save()
        except Exception as e: 
            print(e)
        return redirect('home')
    # Bei bearbeitetem Vokabel
    elif request.method == 'POST' and request.POST.get('is_edited_vocab', None):
        try:
            vocab = newVocabulary.objects.get(id=request.POST.get('id'))
            vocab.english_word = request.POST.get('english')
            vocab.german_word = request.POST.get('german')
            vocab.save()
        except: 
            pass
        return redirect('home')
    # Bei gelöschetem Vokabel
    elif request.method == 'POST' and request.POST.get('is_delete_vocab', None):
        try:
            vocab = newVocabulary.objects.get(id=request.POST.get('ide'))
            vocab.delete()
        except:
            print("Fehler")
        return redirect('home')
    # Bei neuem eigenen Vokabel
    elif request.method == 'POST' and request.POST.get('is_new_vocab', None):
        try:
            vocab = newVocabulary(german_word=request.POST.get('german'), english_word=request.POST.get('english'))
            vocab.save()
            return JsonResponse({'success': True})
        except: 
            pass
        return JsonResponse({'success': False})
    # Bei Frage nach Vokabeln
    elif request.method == 'POST' and request.POST.get('is_vocab_get', None):
        vocabulary = newVocabulary.objects.exclude(english_word__isnull=True).exclude(german_word__isnull=True).values_list('english_word', 'german_word')
        return JsonResponse(list(vocabulary), safe=False)
    # Beim Hinzufügen eines Textes
    elif request.method == 'POST':
        form = PostForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            translate()
            count(newText.objects.last())
        else:
            print(form.errors)
        return redirect('home')
    # Rückgabe an Seite
    context1 = {'form':form, 'posts':posts, 'vocabulary':vocabulary}
    return render(request, 'home/index.html', context1)