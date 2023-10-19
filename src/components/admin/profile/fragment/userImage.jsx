export default function UserImage({
    url,
}){
    return (
        <img
        src={url}
        className={`shadow-xl object-cover ring-2 z-10 ring-white rounded-full w-40 h-40 align-middle border-none absolute -m-16 lg:-ml-16 bg-white`}
        />
    );
}