#!/bin/bash
curl -d "exception=ReferenceError: getKaese is not defined" http://localhost/gctour/error/query -v
