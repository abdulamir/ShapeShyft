import uuid
from datetime import datetime, timedelta

import pytz
from tortoise import fields, models

from app.config import auth_settings
from app.schemas.auth import TokenResponse
from app.services.auth import create_access_token, hash_password, check_password
from app.utils.exception import ShapeShyftException
from app.utils.validation import is_valid_email, is_valid_phone_number

from .audit import AuditableModel
from .token import UserToken


class UserAccount(AuditableModel):
    uuid = fields.UUIDField(pk=True, default=uuid.uuid4)
    phone_number = fields.CharField(max_length=30, unique=True)
    email = fields.CharField(max_length=150, null=True, unique=True)

    first_name = fields.CharField(max_length=100, null=True)
    last_name = fields.CharField(max_length=110, null=True)
    age = fields.IntField(null=True)
    weight = fields.IntField(null=True)
    height = fields.IntField(null=True)
    suggested_calories = fields.IntField(null=True)

    date_joined = fields.DatetimeField(auto_now_add=True)
    last_login = fields.DatetimeField(auto_now=True)

    hashed_password = fields.CharField(max_length=300, null=True)

    class Meta:
        table = "user_account_11_17_2023"

    def __str__(self):
        return f"{self.phone_number}"

    async def set_password(self, password: str) -> None:
        self.hashed_password = await hash_password(password)
        await self.save()

    async def check_password(self, password) -> bool:
        return await check_password(self.hashed_password, password)

    async def create_access_token(self) -> TokenResponse:
        jti = uuid.uuid4()
        refresh_expire = datetime.utcnow() + timedelta(
            days=auth_settings.refresh_token_expire_days
        )

        token: TokenResponse = await create_access_token(
            self.uuid,
            jti,
            self.phone_number,
            self.email,
        )
        await UserToken.create(
            jti=jti,
            user=self,
            refresh_token=token.refresh_token,
            expire=refresh_expire,
        )
        return token

    @classmethod
    async def get_by_identifier(cls, identifier: str) -> "UserAccount":
        user_field = "phone_number"

        if is_valid_email(identifier):
            user_field = "email"

        query = {user_field: identifier.lower()}

        user = await cls.get_or_none(**query)

        if not user:
            raise ShapeShyftException("E1002")

        return user
