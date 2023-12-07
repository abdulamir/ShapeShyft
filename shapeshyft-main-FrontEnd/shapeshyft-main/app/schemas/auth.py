from typing import Optional

from pydantic import UUID4, BaseModel, validator, Field

from app.utils.validation import is_valid_email, is_valid_phone_number

from .general import Password, Response


class TokenResponse(Response):
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(..., description="Type of token")


class TokenData(BaseModel):
    sub: str
    phone_number: str
    email: Optional[str] = None
    exp: int
    token_type: str


class RefreshTokenData(BaseModel):
    sub: str
    exp: int
    token_type: str
    jti: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="JWT refresh token")



class UsernamePasswordLoginRequest(Password):
    username: str = Field(
        ..., description="Username of the user (email or phone number)"
    )


    @validator("username", pre=True, always=True)
    def validate_username(cls, v):
        return v.lower()

