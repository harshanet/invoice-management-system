output "frontend_url" {
  description = "Public Amplify URL for the React app."
  value       = "https://main.${aws_amplify_app.frontend.default_domain}"
}

output "backend_url" {
  description = "HTTPS backend via CloudFront (-> nginx :80 -> Node :5001)."
  value       = "https://${aws_cloudfront_distribution.backend.domain_name}"
}

output "ec2_public_ip" {
  description = "Elastic IP of the backend instance."
  value       = aws_eip.backend.public_ip
}

output "ssm_connect" {
  description = "Shell into the box without SSH."
  value       = "aws ssm start-session --target ${aws_instance.backend.id} --region ${var.region}"
}
