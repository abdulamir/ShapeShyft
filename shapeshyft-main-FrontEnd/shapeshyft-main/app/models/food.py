from .audit import AuditableModel
from enum import Enum
from tortoise import fields, models
import uuid


class FoodType(Enum):
    BREAKFAST = "BREAKFAST"
    LUNCH = "LUNCH"
    DINNER = "DINNER"
    SNACK = "SNACK"


class Food(AuditableModel):
    uuid = fields.UUIDField(pk=True, default=uuid.uuid4)
    user = fields.ForeignKeyField("models.UserAccount", related_name="foods")
    type = fields.CharEnumField(FoodType)
    name = fields.CharField(max_length=100)
    unit = fields.CharField(max_length=100)
    calories = fields.CharField(max_length=100)
    fat = fields.CharField(max_length=100)
    carbs = fields.CharField(max_length=100)
    protein = fields.CharField(max_length=100)
    link = fields.CharField(max_length=100)
    number_of_units = fields.IntField()
    date = fields.DateField()

    class Meta:
        table = "foods_11-17-2023"

class Meals(AuditableModel):
    uuid = fields.UUIDField(pk=True, default=uuid.uuid4)
    user = fields.ForeignKeyField("models.UserAccount", related_name="mealplan")
    breakfast = fields.CharField(max_length = 100)
    lunch = fields.CharField(max_length = 100)
    dinner = fields.CharField(max_length = 100)
    snack = fields.CharField(max_length = 100)
    calories = fields.CharField(max_length = 10)
    class Meta: 
        table = "DailyMealPlan_11_17_2023"
        
class Calories(AuditableModel):
    email = fields.CharField(max_length = 100, pk = True)
    user = fields.ForeignKeyField("models.UserAccount", related_name="calories")
    calories = fields.CharField(max_length = 100)

    class Meta: 
        table = "UserCalorieEntries_11_17_2023"