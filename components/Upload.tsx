import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ImageIcon, UploadIcon } from 'lucide-react';
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_UPLOAD_BYTES,
	MAX_UPLOAD_MB,
	PROGRESS_INCREMENT,
	PROGRESS_INTERVAL_MS,
	REDIRECT_DELAY_MS,
} from '../lib/consstants';

const Upload = () => {
	const [file, setFile] = useState<File | null>(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const { isSignedIn } = useAuth();

	const onDrop = useCallback((accepted: File[], rejections: FileRejection[]) => {
		if (rejections.length > 0) {
			const code = rejections[0].errors[0]?.code;
			setError(
				code === 'file-too-large'
					? `File must be under ${MAX_UPLOAD_MB} MB`
					: 'Only JPG and PNG floor plans are supported'
			);
			return;
		}

		if (accepted[0]) {
			setError(null);
			setProgress(0);
			setFile(accepted[0]);
			console.log(accepted[0])
		}
	}, []);

	// Tick the progress bar while a file is staged.
	useEffect(() => {
		if (!file) return;

		const interval = setInterval(() => {
			setProgress((prev) => Math.min(prev + PROGRESS_INCREMENT, 100));
		}, PROGRESS_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [file]);

	// Clear the file once it finishes so the dropzone comes back.
	useEffect(() => {
		if (progress < 100) return;

		const timeout = setTimeout(() => {
			setFile(null);
			setProgress(0);
		}, REDIRECT_DELAY_MS);

		return () => clearTimeout(timeout);
	}, [progress]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: ACCEPTED_IMAGE_TYPES,
		maxFiles: 1,
		maxSize: MAX_UPLOAD_BYTES,
		disabled: !isSignedIn,
	});

	return (
		<div className='upload'>
			{!file ? (

				<div {...getRootProps({ className: `dropzone ${isDragActive ? 'is-dragging' : ''}` })}>
					<input {...getInputProps({ className: 'drop-input' })} />

					<div className='drop-content'>
						<div className='drop-icon'>
							<UploadIcon size={20}/>
						</div>
						<p>
							{isSignedIn ? (
								"Click or Drag & Drop your floor plan"
							) : (
								"Sign in to upload your floor plan"
							)}
						</p>
						<p className='help'>
							{error ?? `JPG or PNG, maximum file size ${MAX_UPLOAD_MB} MB`}
						</p>
					</div>
				</div>

			) : (
				<div className='upload-status'>
					<div className='status-content'>
						<div className='status-icon'>
							{progress === 100 ? (
								<CheckCircle size={20} className='check'/>
							) : (
								<ImageIcon className='image'/>
							)}
						</div>

						<h3>{file.name}</h3>

						<div className='progress'>
							<div className='bar' style={{ width: `${progress}%`}} />
						</div>

						<p className='status-text'>
							{progress < 100 ? 'Analyzing Floor Plan' : 'Redirecting'}
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default Upload;
