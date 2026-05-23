# ---------------------------------------------------------------------------
# Bootstrap: run this ONCE with local state to create the S3 bucket +
# DynamoDB lock table that the main stack (../) uses as its remote backend.
# This solves the chicken-and-egg: the backend must exist before the main
# stack can `terraform init` against it.
#
#   cd infra/bootstrap
#   terraform init
#   terraform apply -var="bucket_name=<globally-unique-name>"
#
# Both resources sit comfortably inside the AWS Free Tier.
# ---------------------------------------------------------------------------

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "tfstate" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket                  = aws_s3_bucket.tfstate.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "tflock" {
  name         = var.lock_table_name
  billing_mode = "PAY_PER_REQUEST" # on-demand: no idle cost, free-tier friendly
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
