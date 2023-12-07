from typing import Optional

from pydantic import UUID4, BaseModel, EmailStr, validator, Field


from .general import Response, Password

import datetime


class UserAccountCreateRequest(Password):
    phone_number: str
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = 0
    weight: Optional[int] = 0
    height: Optional[int] = 0


class UserAccount(BaseModel):
    uuid: UUID4
    phone_number: str
    email: Optional[EmailStr] = None


class UserAccountResponse(Response):
    uuid: UUID4
    phone_number: str
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[int] = None
    height: Optional[int] = None
    suggested_calories: Optional[int] = None
    date_joined: datetime.datetime
    last_login: datetime.datetime
