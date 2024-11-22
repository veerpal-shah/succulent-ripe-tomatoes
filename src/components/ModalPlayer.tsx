import Modal from '@mui/material/Modal';

type ModalPlayerProps = {
    open: boolean,
    videoID: string | undefined,
    onClose: any,
};

export default function ModalPlayer({ open, videoID, onClose }: ModalPlayerProps) {

    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropProps={{
                style: {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
            }}
        >
            <div style={{ 
                width: '100%', 
                aspectRatio: '16 / 9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '3.8%',
            }}>
                <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoID}?autoplay=1&color=white&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
            </div>
        </Modal>
    );
}