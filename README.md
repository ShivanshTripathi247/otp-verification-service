# OTP Verification Service - NodeJS + Redis
## Introduction
In this project I have attempted to replicate production level OTP service. My motivation behind building this services is to learn how industry level backend operates under the hood.

## Architecture
I have divided this backend application  into 5 main components 

#### 1. Adapters
The External Connectors.
#### 2. APIs
The Express App setup.
#### 3. Services
The "Brains" / Business Logic.
#### 4. Utils
Contains basic utilities for the whole backend and loggers.
#### 5. Workers
Standalone script: The background processor

----


### Example .env
----
```
# express app port
PORT = 
# redis server port
REDIS_PORT = 
# redis server hostname
REDIS_HOSTNAME = 
# redis database serial no.
REDIS_DB =
```
