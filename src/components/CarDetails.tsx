import React, { useState, useEffect, useMemo } from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import api from "../services/customer_api";
import { carBrand, carModel } from '../data/malaysiaLocations';
import { toast } from 'react-toastify';

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
}

const CarDetails: React.FC<CarDetailsProps> = ({
	onBack,
	onContinue,
	onLogout,
	onViewBookingHistory,
	bookingCarBrand,
	bookingCarModel,
	bookingCarYear,
	bookingCarNumber
}) => {
	const [carBrands, setCarBrands] = useState<carBrand[]>([]);
	const [carModels, setCarModels] = useState<carModel[]>([]);
	const [brand, setBrand] = useState(bookingCarBrand || '');
	const [model, setModel] = useState(bookingCarModel || '');
	const [year, setYear] = useState(bookingCarYear || '');
	const [plateNumber, setPlateNumber] = useState(bookingCarNumber || '');

	const fetchCardetails = async () => {
		await api.get('/customer/cardetails').then((response) => {
			const data = response.data.data;
			setCarBrands(data.carBrand);
			setCarModels(data.carModel);
		}).catch((error: any) => {
			setCarBrands([]);
			setCarModels([]);
		})
	}
	const filteredModel = useMemo(() => {	
		if (!carBrands) return [];
		return carModels.filter((model: carModel) => model.carBrand.name === brand);
	}, [brand, carModels]);

	
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

	return (
		<MobileContainer>
			<div className="min-h-screen bg-gray-50">
				<Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} />
				<div className="flex flex-col h-full">
					{/* Progress Steps */}
					<div className="px-4 py-4 border-b bg-white">
						<div className="flex items-center justify-between">
							<div className="flex-1 flex items-center">
								<div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
								<div className="flex-1 h-0.5 bg-green-500"></div>
							</div>
							<div className="flex-1 flex items-center">
								<div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
								<div className="flex-1 h-0.5 bg-green-500"></div>
							</div>
							<div className="flex-1 flex items-center">
								<div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">3</div>
								<div className="flex-1 h-0.5 bg-gray-300"></div>
							</div>
							<div className="flex-1 flex items-center">
								<div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm">4</div>
								<div className="flex-1 h-0.5 bg-gray-300"></div>
							</div>
							<div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm">5</div>
						</div>

						<div className="mt-2 flex justify-between text-xs">
							<span className="text-green-500">Location</span>
							<span className="text-green-500">Appointment</span>
							<span className="text-blue-500">Car Details</span>
							<span className="text-gray-500">Service Type</span>
							<span className="text-gray-500">Summary</span>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1 overflow-auto">
						<div className="p-4">
							<div className="flex items-center mb-4">
								<button
									onClick={onBack}
									className="flex items-center text-blue-500"
								>
									<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
									Back
								</button>
								<h2 className="text-lg font-semibold ml-3">Car Details</h2>
							</div>

							<div className="space-y-4">
								{/* Car Brand */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Car Brand
									</label>
									<select
										value={brand}
										onChange={(e) => {
											console.log('CarDetails: Brand selected', e.target.value);
											setBrand(e.target.value);
											setModel('Select Model');
										}}
										className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
									>	
										<option value=''>Select car brand</option>
										{carBrands.map((car: carBrand) => (
											<option key={car.name} value={car.name}>
												{car.name}
											</option>
										))}
									</select>
								</div>

								{/* Car Model */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Car Model
									</label>
									<select
										value={model}
										onChange={(e) => {
											console.log('CarDetails: Model selected', e.target.value);
											setModel(e.target.value);
										}}
										className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
										disabled={brand === 'Select Brand'}
									>
										<option value="">Select an model</option>
										{filteredModel.map((model: carModel) => (
											<option key={model.name} value={model.name}>
												{model.name}
											</option>
										))}
									</select>
								</div>

								{/* Manufacturing Year */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Manufacturing Year
									</label>
									<select
										value={year}
										onChange={(e) => {
											console.log('CarDetails: Year selected', e.target.value);
											setYear(e.target.value);
										}}
										className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
									>
										{years.map((y) => (
											<option key={y} value={y}>{y}</option>
										))}
									</select>
								</div>

								{/* Plate Number */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
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
										className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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