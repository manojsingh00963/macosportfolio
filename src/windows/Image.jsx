import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper';
import  useWindowStore  from '#store/window';

const Image = () => {
    const { windows } = useWindowStore();
    const data = windows.imgfile.data;

    if (!data) return null;

    const { name, imageUrl } = data;

    return (
        <>
            <div className="window-header">
                <WindowControls target="imgfile" />
                <h2>{name}</h2>
            </div>
            <div className="image-content">
                <img src={imageUrl} alt={name} />
            </div>
        </>
    )
}

const ImageWindow = WindowWrapper(Image, 'imgfile');
export default ImageWindow;
