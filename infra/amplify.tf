# Frontend hosting via AWS Amplify using MANUAL DEPLOY.
#
# Amplify's native build pipeline cannot assume an IAM role in this account
# (fails at build env startup with "Unable to assume specified IAM Role",
# regardless of role config). So instead of letting Amplify build from the
# repo, the React app is built in GitHub Actions and the finished artifact is
# pushed to Amplify via `aws amplify create-deployment` + `start-deployment`.
# A manual-deploy app must NOT be connected to a Git repository, so there is
# no `repository` / `access_token` / auto-build here.

resource "aws_amplify_app" "frontend" {
  name     = "lrl-frontend"
  platform = "WEB"

  # REACT_APP_API_URL is baked into the build by the GitHub Actions job (CRA
  # reads it at build time); kept here as documentation of the intended value.
  environment_variables = {
    REACT_APP_API_URL = "https://${aws_cloudfront_distribution.backend.domain_name}"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = "main"
  framework   = "React"
  stage       = "PRODUCTION"
}
