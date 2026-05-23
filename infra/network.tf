# Use the account's default VPC rather than provisioning a new one
data "aws_vpc" "default" {
  default = true
}

# AWS-managed prefix list of CloudFront's origin-facing IP ranges, so only
# CloudFront can reach the origin directly
data "aws_ec2_managed_prefix_list" "cloudfront" {
  name = "com.amazonaws.global.cloudfront.origin-facing"
}

resource "aws_security_group" "backend" {
  name        = "lrl-backend-sg"
  description = "Learning Resource Library backend (nginx + Node, behind CloudFront)"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "HTTP from CloudFront edge only (TLS terminates at CloudFront)"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    prefix_list_ids = [data.aws_ec2_managed_prefix_list.cloudfront.id]
  }

  ingress {
    description = "SSH (optional; SSM is the primary access path)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ingress_cidr]
  }

  # Node :5001 is never exposed; only nginx (:80) is reachable, and only from CloudFront

  egress {
    description = "All outbound (npm, GitHub, SSM)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "lrl-backend-sg"
    Project = "Learning-Resource-Library"
  }
}
