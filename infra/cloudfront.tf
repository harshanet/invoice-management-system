# CloudFront sits in front of the EC2 backend and provides managed TLS at the
# edge via the default *.cloudfront.net certificate.

# AWS-managed cache/origin policies
data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

resource "aws_cloudfront_distribution" "backend" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "Learning Resource Library backend API"
  price_class     = "PriceClass_All" # include AU/Asia edges

  origin {
    # EIP's public DNS name
    domain_name = aws_eip.backend.public_dns
    origin_id   = "lrl-ec2-backend"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only" # CloudFront
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "lrl-ec2-backend"
    viewer_protocol_policy = "redirect-to-https"

    # Forward everything, cache nothing.
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name    = "lrl-backend-cf"
    Project = "Learning-Resource-Library"
  }
}
