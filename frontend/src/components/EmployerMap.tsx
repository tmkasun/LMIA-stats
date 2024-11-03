import L, { LatLngTuple } from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IByAddress } from "~/types/employerStats";
interface IEmployerMap {
    addresses?: IByAddress[];
}
const LT: any = L;

const searchedLocationMarker = new LT.icon({
    iconUrl: "https://nishati-us.com/wp-content/uploads/2014/09/red-location-icon-map-png-4.png",

    iconSize: [30, 40], // size of the icon
    iconAnchor: [0, 35], // point of the icon which will correspond to marker's location
    popupAnchor: [25, 0], // point from which the popup should open relative to the iconAnchor
});

export const EmployerMap = (props: IEmployerMap) => {
    const { addresses } = props;
    if (!addresses) return "No addresses found";
    const firstAddress = addresses[0];
    if (!firstAddress) return "First address is missing";
    const center = [addresses[0].geolocation?.lat, addresses[0].geolocation?.lon] as LatLngTuple;
    return (
        <MapContainer tap={false} zoomControl={false} className="h-96" center={center} zoom={8} scrollWheelZoom>
            {/* <ChangeView center={mapCenter} zoom={zoom} /> */}
            <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                accessToken="pk.eyJ1IjoidG1rYXN1biIsImEiOiJlNmZhOTYwNGJlODcxYWE5YjNmYjYzZmJiM2NlZWM4YiJ9.UT41ORairJ1PQ7woCnCH-A"
                id="mapbox/streets-v11"
                tileSize={512}
                zoomOffset={-1}
            />

            {addresses.map((address) => {
                if (!address.geolocation) return null;
                if (!address.geolocation.lat || !address.geolocation.lon) {
                    console.error("Invalid geolocation", address);
                    return null;
                }
                return (
                    <Marker
                        icon={searchedLocationMarker}
                        key={address._id}
                        position={[address?.geolocation?.lat, address?.geolocation?.lon]}
                    >
                        <Popup>
                            <div>
                                <p>{address._id}</p>
                                <p>Total Positions: {address.totalPositions}</p>
                                <p>Total LMIAs: {address.totalLMIAs}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default EmployerMap;
