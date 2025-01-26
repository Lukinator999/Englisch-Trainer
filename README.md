# Englisch-Trainer
Eine webbasierte App zum Verbessern des Englisch-Wortschatzes. 
Man kann eigene Texte hinzufügen, welche man mit Übersetzung lesen kann. Neue Wörter kann man zu seinen Vokabeln hinzufügen und in der Vokabel-Sektion lernen.

## Installation
Lade den Code herunter und führe die folgenden Befehle im Terminal aus:
```bash
python -m venv env
./env/Scripts/activate
python -m pip install Django
pip install deep_translator
pip install whitenoise
pip install waitress
```
```bash
python manage.py migrate
python manage.py makemigrations
py manage.py collectstatic
```

## Usage
Schreibe deinen Django Secret Key in das entsprechende Feld in settings.py:
```python
SECRET_KEY = ''
```
Und führe
```bash
python manage.py runserver
```
aus.
