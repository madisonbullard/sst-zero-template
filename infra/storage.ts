export const storage = new sst.aws.Bucket("Storage", {
	transform: {
		publicAccessBlock: {
			blockPublicAcls: false,
			blockPublicPolicy: false,
			ignorePublicAcls: false,
			restrictPublicBuckets: false,
		},
	},
});

new aws.s3.BucketOwnershipControls("ownership-controls", {
	bucket: storage.name,
	rule: {
		objectOwnership: "ObjectWriter",
	},
});
