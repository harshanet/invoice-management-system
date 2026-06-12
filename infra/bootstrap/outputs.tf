output "state_bucket" {
  description = "Pass this to the main stack's `terraform init -backend-config=\"bucket=...\"`."
  value       = aws_s3_bucket.tfstate.id
}

output "lock_table" {
  description = "Pass this to the main stack's `terraform init -backend-config=\"dynamodb_table=...\"`."
  value       = aws_dynamodb_table.tflock.name
}
