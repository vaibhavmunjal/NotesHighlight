from django.db import models

class Highlight_Notes(models.Model):
    content = models.TextField()
    content_range = models.CharField(max_length=10)
    notes = models.TextField()

    def __str__(self):
        return str(self.content)
