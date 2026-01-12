import useWindowStore from '#store/window';

const WindowControls = ({ target }) => {
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximize,
  } = useWindowStore();

  return (
    <div id="window-controls">
      <div className="close w-4 h-4 cursor-pointer " onClick={() => closeWindow(target)} />
      <div className="minimize w-4 h-4 cursor-pointer " onClick={() => minimizeWindow(target)} />
      <div className="maximize w-4 h-4 cursor-pointercursor-pointer  " onClick={() => toggleMaximize(target)} />
    </div>
  );
};

export default WindowControls;
