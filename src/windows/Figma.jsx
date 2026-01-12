import { WindowControls } from '#components';
import WindowWrapper from '#hoc/windowWrapper';
import  useWindowStore from '#store/window';

const Figma = () => {
    const { windows } = useWindowStore();
    const data = windows.figfile.data;

    if (!data) return null;

    const { name } = data;

    return (
        <>
            <div className="window-header">
                <WindowControls target="figfile" />
                <h2>{name}</h2>
            </div>
            <div className="figma-content">
                <p>Figma files can't be opened here. You can view the design at:</p>
                <a href={data.href} target="_blank" rel="noopener noreferrer">{data.href}</a>
            </div>
        </>
    )
}

const FigmaWindow = WindowWrapper(Figma, 'figfile');
export default FigmaWindow;
