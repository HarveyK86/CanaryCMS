# CanaryCMS
## C9 Setup
1. `sudo apt install python3.5-venv`
2. `python3.5 -mvenv venv`
3. `source venv/bin/activate`
4. `sudo pip install -r venv-requirements.txt`
5. `export SECRET_KEY="$(openssl passwd -1 <your password here>)"`
6. `python CanaryCMS/manage.py migrate`
7. `python CanaryCMS/manage.py runserver 0.0.0.0:8080`

## Useful Commands
1. `pip freeze > venv-requirements.txt`