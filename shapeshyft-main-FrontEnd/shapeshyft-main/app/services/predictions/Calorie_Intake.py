#!/usr/bin/env python
# coding: utf-8

# In[25]:


import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import json

# bmr computation
def compute_bmr(weight, height, age):
    male_bmr = (88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)) * 1.2
    female_bmr = (447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)) * 1.2
    return (male_bmr + female_bmr) / 2

data_size = 10000
np.random.seed(0)

weights = np.random.uniform(50, 100, data_size)
heights = np.random.uniform(150, 200, data_size)
ages = np.random.uniform(18, 65, data_size)

bmrs = np.array([compute_bmr(w, h, a) for w, h, a in zip(weights, heights, ages)])
actual_intakes = bmrs + np.random.normal(0, 150, data_size)

X = np.column_stack((weights, heights, ages))
y = actual_intakes

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# linear regression
regressor = LinearRegression().fit(X_train, y_train)
y_pred = regressor.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)

# predicting using trained model
async def predict_caloric_intake(weight, height, age, threshold=500):
    '''
    Inputs: weight(kg), height(cm), age
    Output: Recommended Daily Calorie Intake(kcal)
    '''
    bmr_intake = compute_bmr(weight, height, age)
    
    features = np.array([weight, height, age]).reshape(1, -1)
    model_intake = regressor.predict(features)[0]
    
    # choose the best result based on the comparison
    difference = abs(bmr_intake - model_intake)
    final_intake = bmr_intake if difference > threshold else model_intake
    
    return round(final_intake)


# In[26]:

'''
output1 = predict_caloric_intake(70, 175, 30)
print(json.dumps(output1, indent=4))

output2 = predict_caloric_intake(65, 168, 25)
print(json.dumps(output2, indent=4))

output3 = predict_caloric_intake(60, 171, 21)
print(json.dumps(output3, indent=4))
'''
