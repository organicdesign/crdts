export default () => {
	let time = 0;

	return () => (++time).toString(16).padStart(10, "0");
};
