export type S3UploadedFile = {
    key: string,
    location: string
}

export type GovernmentIdImage = {
    front: {key: string, url: string}, 
    back?: {key: string, url: string}
};

export type DbFileType = {
    key: string, 
    url: string,
}

export type TokenType = {
    token: string,
	refresh_token: string,
	expires_in: number,
	ibs_client_id: string,
	date: number
};