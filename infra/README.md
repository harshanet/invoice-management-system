# Infrastructure (Terraform)

End-to-end IaC for the Learning Resource Library:

- **Frontend** → AWS Amplify hosting via **manual deploy** (`amplify.tf`). Amplify's native build pipeline can't assume an IAM role in this account, so the React app is built in GitHub Actions (`.github/workflows/frontend-deploy.yml`) and the artifact is pushed to Amplify with `create-deployment` / `start-deployment` — no Amplify build step. The Amplify app is intentionally NOT connected to the repo.
- **Backend** → EC2 `t3.micro` + Elastic IP, nginx (HTTP :80), PM2, and a self-registering GitHub Actions runner — `ec2.tf` + `user_data.sh.tpl`
- **HTTPS** → CloudFront in front of the EC2 origin provides managed TLS (`*.cloudfront.net`); no domain or cert to manage — `cloudfront.tf`
- **State** → S3 bucket + DynamoDB lock table (`bootstrap/`)

```
push to main ─┬─► frontend-deploy.yml (ubuntu-latest): npm build → zip → Amplify manual deploy
              └─► deploy.yml (self-hosted runner on EC2): backend restart (PM2 :5001)

Browser ──HTTPS──► Amplify CDN                    (React app)
Browser ──HTTPS──► CloudFront ──HTTP──► nginx :80 ──► Node :5001 ──► MongoDB Atlas
         (managed TLS, *.cloudfront.net)   (SG admits CloudFront edge IPs only)
```

## One-time setup

### 1. Bootstrap the remote state backend (local state, run once)

```bash
cd infra/bootstrap
terraform init
terraform apply -var="bucket_name=lrl-tfstate-<your-unique-suffix>"
# note the two outputs: state_bucket, lock_table
```

### 2. Add GitHub repo secrets (Settings → Secrets and variables → Actions)

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user with EC2/IAM/Amplify/S3/DynamoDB perms |
| `GH_PAT` | GitHub PAT, scopes: `repo` + `manage_runners` (Amplify connect + runner registration) |
| `PROD` | full backend `.env` body (`MONGO_URI`, `JWT_SECRET`, `PORT=5001`) |
| `TF_STATE_BUCKET` | the `state_bucket` output from step 1 |
| `TF_LOCK_TABLE` | the `lock_table` output from step 1 (`lrl-tflock`) |

## Deploy / destroy

GitHub → **Actions** → **Infra (Terraform)** → **Run workflow** → choose `apply` or `destroy`.

- `apply` → stands up the whole stack and prints `frontend_url`, `backend_url`, `ec2_public_ip`.
- `destroy` → tears everything down (billing back to ~$0).

## Run locally instead

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # fill it in
terraform init \
  -backend-config="bucket=<state_bucket>" \
  -backend-config="dynamodb_table=lrl-tflock" \
  -backend-config="region=ap-southeast-2"
terraform apply      # or: terraform destroy
```

## Cost / Free Tier notes

- `t3.micro`, ≤30GB EBS, S3, DynamoDB (on-demand), Amplify build minutes, CloudFront (1TB out/mo for 12 months) → all Free-Tier eligible.
- **Public IPv4** is billed ~$0.005/hr (~$3.60/mo) while running — unavoidable, but `destroy` releases it. Spin up only when demoing.
- **CloudFront** distributions take ~5–15 min to deploy *and* to delete, so `apply`/`destroy` runs are slower than the rest of the stack. No rate limits to worry about (managed TLS, no Let's Encrypt).

## Access the box without SSH

```bash
aws ssm start-session --target <instance-id> --region ap-southeast-2
```

## First boot takes a few minutes

`apply` returns once resources are created, but `user_data` (Node install, clone, runner registration) runs for ~3–5 min after, and the CloudFront distribution can take ~15 min to finish deploying. Check the box's progress via SSM:

```bash
sudo tail -f /var/log/cloud-init-output.log
```
