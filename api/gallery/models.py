from django.db import models

# Create your models here.

class GalleryEntry(models.Model):
    function_expression = models.CharField(max_length=500)
    tex_string = models.CharField(max_length=500)
    variable_name = models.CharField(max_length=10)

    def __str__(self):
        return self.function_expression