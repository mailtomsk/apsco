import React, { useState, useEffect, useMemo } from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import api from "../services/customer_api";
import { carBrand, carModel } from '../data/malaysiaLocations';
import { toast } from 'react-toastify';
import { setStep } from "../auth/bookingSlice";
import { useAppDispatch } from "../hooks";
import StepProgress from './StepProgress';

interface CarDetailsProps {
	onBack: () => void;
	onContinue: (carDetails: {
		brand: string;
		model: string;
		year: string;
		plateNumber: string;
	}) => void;
	onLogout: () => void;
	onViewBookingHistory: () => void;
	bookingCarBrand: any;
	bookingCarModel: any;
	bookingCarYear: any;
	bookingCarNumber: any;
	onLogin: () => void;
	onViewLocation: () => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({
	onBack,
	onContinue,
	onLogout,
	onViewBookingHistory,
	bookingCarBrand,
	bookingCarModel,
	bookingCarYear,
	bookingCarNumber,
    onLogin,
	onViewLocation,
}) => {
	const [carBrands, setCarBrands] = useState<carBrand[]>([]);
	const [carModels, setCarModels] = useState<carModel[]>([]);
	const [brand, setBrand] = useState(bookingCarBrand || '');
	const [model, setModel] = useState(bookingCarModel || '');
	const [year, setYear] = useState(bookingCarYear || '');
	const [plateNumber, setPlateNumber] = useState(bookingCarNumber || '');
	const userId = localStorage.getItem("customer_id");
	const dispatch = useAppDispatch();
	const fetchCardetails = async () => {

		try {

			if (userId) {
				const bookingResponse = await api.get(`/customer/cardetails-booking-history?customer_id=${userId}`);
				const customerBooking = bookingResponse.data.data;

				if (customerBooking && customerBooking.car_brand && customerBooking.car_model) {
					const upperCaseCarNumber = customerBooking.car_number?.toUpperCase() || '';

					// Set pre-filled values
					setBrand(customerBooking.car_brand);
					setModel(customerBooking.car_model);
					setYear(customerBooking.manufacturing_year);
					setPlateNumber(upperCaseCarNumber);
				} 
			} else {
				await api.get('/customer/cardetails').then((response) => {
					const data = response.data.data;
					console.log("data", data);
					setCarBrands(data.carBrand);
					setCarModels(data.carModel);
				}).catch((error: any) => {
					setCarBrands([]);
					setCarModels([]);
				})
			}

			const carResponse = await api.get('/customer/cardetails');
			const carData = carResponse.data.data;

			setCarBrands(carData.carBrand);
			setCarModels(carData.carModel);


		} catch (error) {
			console.error("Error loading car details:", error);
			setCarBrands([]);
			setCarModels([]);
		}
		
		/* await api.get('/customer/cardetails').then((response) => {
			const data = response.data.data;
			console.log("data", data);
			setCarBrands(data.carBrand);
			setCarModels(data.carModel);
		}).catch((error: any) => {
			setCarBrands([]);
			setCarModels([]);
		}) */
	}
	const filteredModel = useMemo(() => {	
		if (!carBrands) return [];
		return carModels.filter((model: carModel) => model.carBrand.name === brand);
	}, [brand, carModels]);

	const currentSteps = (currentStepString: string) => {
		dispatch(setStep(currentStepString));
	};
	useEffect(() => {
		fetchCardetails();
	}, []);

	const years = ['Select Year', ...Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString())];

	const handleContinue = () => {
		try {
			if (brand && model && year && plateNumber) {
				onContinue({ brand, model, year, plateNumber });
			} else {
				toast.error(`Cannot continue: missing car details`);
			}
		} catch (err) {
			toast.error(`Error submitting car details: ${err}`);
		}
	};
	
	const isFormValid = (brand !== 'Select Brand' && brand != '') && (model !== 'Select Model' && model != '') && (year !== 'Select Year' && year!='') && (plateNumber.trim() !== '');

	const stepKeys = ['location', 'appointment', 'car-details', 'service-type', 'summary'];
	const stepLabels = ['Location', 'Appointment', 'Car Details', 'Service Type', 'Summary'];
	const currentStep = 2;

	const handleStepClick = (index: number) => {
		if (index <= currentStep) {
		dispatch(setStep(stepKeys[index]));
		}
	};
	
	return (
		<MobileContainer>
			<div className="min-h-screen bg-white">
				<Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} onBack={onBack} onLogin={onLogin} onViewLocation={onViewLocation} />
				<div className="flex flex-col h-full w-full max-w-[420px] mx-auto">
					{/* Progress Steps */}
					<StepProgress/>

					{/* Main Content */}
					<div className="flex-1 overflow-auto">
						<div className="p-4">
							<div className="flex items-center mb-4">
								<h2 className="text-lg font-semibold">Car Details</h2>
							</div>

							<div className="space-y-7">
								{/* Car Brand */}
								<div className="relative">
									<label className="block text-[18px] text-gray-800 mb-1">
										Car Brand
									</label>
									<select
										value={brand}
										onChange={(e) => {
											setBrand(e.target.value);
											setModel('Select Model');
										}}
										className="block appearance-none w-full px-3 py-2 cursor-pointer bg-white border border-gray-300 text-[16px] text-gray-800 focus:ring-blue-500 focus:border-blue-500"
									>	
										<option value=''>Select car brand</option>
										{carBrands.map((car: carBrand) => (
											<option key={car.name} value={car.name}>
												{car.name}
											</option>
										))}
									</select>
									<div className="pointer-events-none absolute top-[75%] right-3 transform -translate-y-1/2 text-gray-600">
										<svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
											<path d="M7 7l3 3 3-3" />
										</svg>
									</div>
								</div>

								{/* Car Model */}
								<div className="relative">
									<label className="block text-[18px] text-gray-800 text-gray-700 mb-1">
										Car Model
									</label>
									<select
										value={model}
										onChange={(e) => {
											setModel(e.target.value);
										}}
										className="block appearance-none w-full px-3 py-2 cursor-pointer bg-white border border-gray-300 text-[16px] text-gray-800 focus:ring-blue-500 focus:border-blue-500"
										disabled={brand === 'Select Brand'}
									>
										<option value="">Select an model</option>
										{filteredModel.map((model: carModel) => (
											<option key={model.name} value={model.name}>
												{model.name}
											</option>
										))}
									</select>
									<div className="pointer-events-none absolute top-[75%] right-3 transform -translate-y-1/2 text-gray-600">
										<svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
											<path d="M7 7l3 3 3-3" />
										</svg>
									</div>
								</div>

								{/* Manufacturing Year */}
								<div className="relative">
									<label className="block text-[18px] text-gray-800 text-gray-700 mb-1">
										Manufacturing Year
									</label>
									<select
										value={year}
										onChange={(e) => {
											console.log('CarDetails: Year selected', e.target.value);
											setYear(e.target.value);
										}}
										className="block appearance-none w-full px-3 py-2 cursor-pointer bg-white border border-gray-300 rtext-[16px] text-gray-800 focus:ring-blue-500 focus:border-blue-500"
									>
										{years.map((y) => (
											<option key={y} value={y}>{y}</option>
										))}
									</select>
									<div className="pointer-events-none absolute top-[75%] right-3 transform -translate-y-1/2 text-gray-600">
										<svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
											<path d="M7 7l3 3 3-3" />
										</svg>
									</div>
								</div>

								{/* Plate Number */}
								<div>
									<label className="block text-[18px] text-gray-800 text-gray-700 mb-1">
										Plate Number
									</label>
									<input
										type="text"
										value={plateNumber}
										onChange={(e) => {
											const upperCaseValue = e.target.value.toUpperCase();
											setPlateNumber(upperCaseValue);
										}}
										placeholder="e.g., ABC1234"
										className="block w-full px-3 py-2 bg-white border border-gray-300 text-[16px] text-gray-800 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>

							<button
								onClick={handleContinue}
								disabled={!isFormValid}
								className={`w-full mt-6 py-2 px-4 rounded-md text-white text-sm font-medium ${isFormValid
										? 'bg-blue-500 hover:bg-blue-600'
										: 'bg-gray-300 cursor-not-allowed'
									}`}
							>
								Continue
							</button>
						</div>
					</div>
				</div>
			</div>
		</MobileContainer>
	);
};

export default CarDetails; 