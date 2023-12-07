from fastapi import APIRouter, HTTPException, Security
from app.models.health import WaterEntries, SleepEntries, BMI
from app.schemas.health import wEntry, wEntryResponse, wGetResponse, sEntry, sEntryResponse, tipResponse, bmiEntry
from app.models.user import UserAccount
from app.services.auth.utils import get_current_user
from app.utils.exception import ShapeShyftException
from datetime import datetime, date, time, timedelta, timezone
from  app.services.recommender.recommend import water_rec,sleep_rec,bmi_rec, bmi_calc
from app.utils.validation import is_valid_time_format

from app.utils.response import responses
from app.utils.exception import ShapeShyftException

import pytz

router = APIRouter(
    tags=["Health profile"],
)

#Get all the entries of water associated with the account.
@router.get("/getWater", response_model=list[wGetResponse], responses=responses)
async def get_water(current_user: UserAccount = Security(get_current_user)):
    """
    This endpoint returns list of water entries for the user
    """
    waterLog = await WaterEntries.all().filter(user=current_user)
    return waterLog 

#Update the water entry for current date.
@router.post("/ceWater", response_model=wEntryResponse, responses=responses)
async def create_or_edit_water_amount(data: wEntry, current_user: UserAccount = Security(get_current_user)):
    """
    This endpoint is used to create/edit a water entry for today's date
    """
    hydration_log, created = await WaterEntries.get_or_create(user=current_user,date=date.today(),defaults={"amt": 0})
    hydration_log.amt = data.amt
    await hydration_log.save()

    return hydration_log

#get sleep log based on date
@router.get("/getSleep", response_model=list[sEntryResponse], responses=responses)
async def get_sleep(current_user: UserAccount=Security(get_current_user)):
    """
    This endpoint returns list of the user's sleep entries
    """
    try:
        sleep_entry = await SleepEntries.all().filter(user=current_user)
        return sleep_entry
    except:
        raise ShapeShyftException("E1023", 404)
    

#create sleep entry for today
@router.post("/ceSleep", response_model=sEntryResponse, responses=responses)
async def create_or_edit_sleep(data : sEntry, current_user: UserAccount = Security(get_current_user)):
    """
    This endpoint is used to create/edit a sleep entry for today's date,
    Time format should be something like "12:04PM" for the strings
    """
    if data.s_time is not None and data.e_time is not None:
        #expected format to be something like 12:04PM
        string1=data.s_time 
        string2=data.e_time

        #check if valid time format given
        if is_valid_time_format(string1) and is_valid_time_format(string2):

            et_timezone = timezone(timedelta(hours=-5))
            start = datetime.strptime(string1, "%I:%M%p").replace(tzinfo=et_timezone)
            end = datetime.strptime(string2, "%I:%M%p").replace(tzinfo=et_timezone)

            #calculate hours of sleep in float val
            s_time=start.timetz()
            e_time=end.timetz()
            duration=end-start
            duration_s=duration.total_seconds()
            hours=duration_s/3600

            sleep_entry, created = await SleepEntries.get_or_create(user=current_user,date=date.today(), defaults={'s_time': time.min, 'e_time': time.min, 'h_slept': 0})
            #PM to AM check
            if(hours<0):
                hours_in=24+hours
            else:
                hours_in=hours

            sleep_entry.s_time=s_time
            sleep_entry.e_time=e_time
            sleep_entry.h_slept=hours_in
            await sleep_entry.save()
            return sleep_entry
        else:
            raise ShapeShyftException("E1025",400)
    else:
        raise ShapeShyftException("E1026",400)
    
@router.post("/cBMI", responses=responses)
async def create_BMI(data: bmiEntry, current_user: UserAccount=Security(get_current_user)):
    bmi_entry, created = await BMI.get_or_create(user=current_user,defaults={"bmi":0,"height":0,"weight":0})
    if(data.height==0):
        raise ShapeShyftException("E1027",400)
    else:
        bmi_entry.height=data.height
        bmi_entry.weight=data.weight
        bmi_entry.bmi=bmi_calc(data.height,data.weight)
        await bmi_entry.save()
        return {"bmi": bmi_entry.bmi}

@router.get("/bmi", responses=responses)
async def get_BMI(current_user: UserAccount=Security(get_current_user)):
    bmi_entry,created= await BMI.get_or_create(user=current_user,defaults={"bmi":0,"height":0,"weight":0})
    return {"bmi" : bmi_entry.bmi}

@router.get("/tips",response_model=tipResponse, responses=responses)
async def tips(current_user: UserAccount = Security(get_current_user)):
    s_entry, created= await SleepEntries.get_or_create(user=current_user,date=date.today(),defaults={'s_time': time.min, 'e_time': time.min, 'h_slept': 0})
    w_entry, created2= await WaterEntries.get_or_create(user=current_user,date=date.today(),defaults={"amt":0})
    bmi, created3= await BMI.get_or_create(user=current_user, defaults={"bmi": 0, "height": 0, "weight":0})
    rec1={
        "w_rec": water_rec(w_entry.amt),
        "s_rec": sleep_rec(18,s_entry.h_slept),
        "bmi" : bmi.bmi
    }
    rec2=bmi_rec(bmi.height, bmi.weight)
    tips={**rec1,**rec2}
    return tips
