from django.db import migrations

def create_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', '', 'lumpia123')

class Migration(migrations.Migration):
    dependencies = [('todos', '0001_initial')]
    operations = [migrations.RunPython(create_superuser)]