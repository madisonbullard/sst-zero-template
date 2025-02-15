const devVpcId = "";
if ($app.stage !== "production" && $app.stage !== "dev" && !devVpcId) {
	throw new Error(
		`You need to declare the ID of the VPC created by the \`dev\` stage so that this stage can use it, instead of creating another VPC per stage (which would needlessly cost $$$).
		After populating your .env file with your AWS profile and SSO session, you can get a list of your VPC IDs by running \`source .env && aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output text\`.
		If you have multiple VPCs, you might need to go into AWS dashboard to verify which VPC is relevant to this app.
		If you have no VPCs deployed, you probably need to create the \`dev\` stage: \`bun sst dev --stage dev\`.
		Once you have the VPC ID, update \`devVpcId\` in \`infra/network.ts\` to match.`,
	);
}

export const vpc =
	$app.stage === "production" || $app.stage === "dev"
		? new sst.aws.Vpc("Vpc", {
				bastion: true,
			})
		: sst.aws.Vpc.get("Vpc", devVpcId);
