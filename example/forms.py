from django import forms
from .models import Vote

# Define the candidate choices
CANDIDATE_CHOICES = [
    ("", "Chosen candidate"),
    ("Klaus-Werner Iohannis", "Klaus-Werner Iohannis"),
    ("Theodor Paleologu", "Theodor Paleologu"),
    ("Ilie-Dan Barna", "Ilie-Dan Barna"),
    ("Hunor Kelemen", "Hunor Kelemen"),
    ("Vasilica-Viorica Dancilă", "Vasilica-Viorica Dancilă"),
    ("Cătălin-Sorin Ivan", "Cătălin-Sorin Ivan"),
    ("Ninel Peia", "Ninel Peia"),
    ("Sebastian-Constantin Popescu", "Sebastian-Constantin Popescu"),
    ("John-Ion Banu", "John-Ion Banu"),
    ("Mircea Diaconu", "Mircea Diaconu"),
    ("Bogdan-Dragoș-Aureliu Marian-Stanoevici", "Bogdan-Dragoș-Aureliu Marian-Stanoevici"),
    ("Ramona-Ioana Bruynseels", "Ramona-Ioana Bruynseels"),
    ("Viorel Cataramă", "Viorel Cataramă"),
    ("Alexandru Cumpănașu", "Alexandru Cumpănașu"),
]

# Define the county choices
COUNTY_CHOICES = [
    ("", "Select your county"),
    ("alba", "Alba"),
    ("arad", "Arad"),
    ("arges", "Argeș"),
    ("bacau", "Bacău"),
    ("bihor", "Bihor"),
    ("bistritanasaud", "Bistrița-Năsăud"),
    ("botosani", "Botoșani"),
    ("brasov", "Brașov"),
    ("braila", "Brăila"),
    ("bucuresti", "București"),
    ("buzau", "Buzău"),
    ("carasseverin", "Caraș-Severin"),
    ("cluj", "Cluj"),
    ("constanta", "Constanța"),
    ("covasna", "Covasna"),
    ("calarasi", "Călărași"),
    ("dolj", "Dolj"),
    ("dambovita", "Dâmbovița"),
    ("galati", "Galați"),
    ("giurgiu", "Giurgiu"),
    ("gorj", "Gorj"),
    ("harghita", "Harghita"),
    ("hunedoara", "Hunedoara"),
    ("ialomita", "Ialomița"),
    ("iasi", "Iași"),
    ("ilfov", "Ilfov"),
    ("maramures", "Maramureș"),
    ("mehedinti", "Mehedinți"),
    ("mures", "Mureș"),
    ("neamt", "Neamț"),
    ("olt", "Olt"),
    ("prahova", "Prahova"),
    ("satumare", "Satu Mare"),
    ("sibiu", "Sibiu"),
    ("suceava", "Suceava"),
    ("salaj", "Sălaj"),
    ("teleorman", "Teleorman"),
    ("timis", "Timiș"),
    ("tulcea", "Tulcea"),
    ("vaslui", "Vaslui"),
    ("vrancea", "Vrancea"),
    ("valcea", "Vâlcea"),
]

class VoteForm(forms.ModelForm):
    choice = forms.ChoiceField(
        choices=CANDIDATE_CHOICES, 
        label="",  # Remove the label
        widget=forms.Select(attrs={
            'class': 'form-control',  # Custom CSS class for consistent styling
        })
    )
    county = forms.ChoiceField(
        choices=COUNTY_CHOICES,
        label="",  # Remove the label
        widget=forms.Select(attrs={
            'class': 'form-control',  # Custom CSS class for consistent styling
        })
    )

    class Meta:
        model = Vote
        fields = ['name', 'choice', 'county']
        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'First and Last Name',
                'class': 'form-control',
            })
        }
        labels = {
            'name': '',  # Remove the label for the name field
        }
