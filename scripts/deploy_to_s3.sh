
BUCKET_NAME=portfolio
ENV=dev

# syncronize all static files to bucket
aws s3 sync ./bucket s3://$BUCKET_NAME/ui/$ENV --exclude *.svg
aws s3 sync ./bucket s3://$BUCKET_NAME/ui/$ENV --exclude '*' --include '*.svg' --no-guess-mime-type --content-type image/svg+xml
aws s3 sync ./json s3://$BUCKET_NAME/ui/$ENV/json

# following row to enable if cloudfront service is present
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths /index.html /build/*

# upload junit report with mochawesome
if [ $ENV = "dev" ]
then
    aws s3 sync ./junit-report s3://$BUCKET_NAME/ui/$ENV/junit-report
fi
