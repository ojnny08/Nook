import { useCallback, useEffect, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ImageIcon, UploadIcon } from 'lucide-react';
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_UPLOAD_BYTES,
	MAX_UPLOAD_MB,
} from '../lib/consstants';
import { uploadFloorPlan } from '../lib/puter.actions';

interface UploadProps {
	/** Called once the floor plan is written to storage. The parent decides what happens next. */
	onUploadComplete: (uid: string, file: File) => void | Promise<void>;
}

const Upload = ({ onUploadComplete }: UploadProps) => {
	const [file, setFile] = useState<File | null>(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [done, setDone] = useState(false);

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
			setDone(false);
			setFile(accepted[0]);
		}
	}, []);

	useEffect(() => {
		if (!file) return;

		let cancelled = false;

		(async () => {
			try {
				const item = await uploadFloorPlan(file, (percent) => {
					if (!cancelled) setProgress(percent);
				});
				if (cancelled) return;
				setProgress(100);

				// awaited so the parent can host the image before it navigates away
				await onUploadComplete(item.uid, file);
				if (cancelled) return;

				setDone(true);
			} catch {
				if (cancelled) return;
				// drop back to the dropzone so the user can retry
				setFile(null);
				setProgress(0);
				setError('Upload failed. Please try again.');
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [file, onUploadComplete]);



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
							{done ? (
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
							{done ? 'Redirecting' : `Uploading Floor Plan ${Math.round(progress)}%`}
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default Upload;
