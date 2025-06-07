"use client";
import React, { useState } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface MappingDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (mapping: Record<string, string>) => void;
	headers: string[];
	suggestions: Record<string, string>;
	fileName: string;
}

const REQUIRED_FIELDS = [
	'Revenue',
	'COGS', 
	'Net Income',
	'Total Assets',
	'Total Liabilities',
	'Shareholders Equity'
];

const OPTIONAL_FIELDS = [
	'Gross Profit',
	'SG&A',
	'EBITDA', 
	'Cash Flow from Operations'
];

const FIELD_DESCRIPTIONS = {
	'Revenue': 'Total revenue or net sales',
	'COGS': 'Cost of goods sold or cost of sales',
	'Gross Profit': 'Revenue minus COGS',
	'SG&A': 'Selling, general & administrative expenses',
	'EBITDA': 'Earnings before interest, taxes, depreciation & amortization',
	'Net Income': 'Bottom line profit after all expenses',
	'Total Assets': 'Sum of all company assets',
	'Total Liabilities': 'Sum of all company debts and obligations',
	'Shareholders Equity': 'Owner\'s equity or net worth',
	'Cash Flow from Operations': 'Cash generated from core business operations'
};

export default function MappingDialog({ 
	isOpen, 
	onClose, 
	onConfirm, 
	headers, 
	suggestions, 
	fileName 
}: MappingDialogProps) {
	const [mapping, setMapping] = useState<Record<string, string>>(suggestions);
	const [errors, setErrors] = useState<Record<string, string>>({});

	if (!isOpen) return null;

	const validateMapping = (): boolean => {
		const newErrors: Record<string, string> = {};
		
		// Check required fields
		REQUIRED_FIELDS.forEach(field => {
			if (!mapping[field]) {
				newErrors[field] = 'This field is required';
			}
		});

		// Check for duplicate mappings
		const usedColumns = new Set<string>();
		Object.entries(mapping).forEach(([field, column]) => {
			if (column && usedColumns.has(column)) {
				newErrors[field] = 'Column already mapped to another field';
			}
			if (column) usedColumns.add(column);
		});

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleConfirm = () => {
		if (validateMapping()) {
			// Filter out undefined values before passing to onConfirm
			const filteredMapping = Object.entries(mapping)
				.filter(([_, column]) => column)
				.reduce((acc, [field, column]) => {
					acc[field] = column;
					return acc;
				}, {} as Record<string, string>);
			onConfirm(filteredMapping);
		}
	};

	const handleFieldMapping = (field: string, column: string) => {
		setMapping(prev => {
			const newMapping = { ...prev };
			if (column === '') {
				delete newMapping[field];
			} else {
				newMapping[field] = column;
			}
			return newMapping;
		});
		
		// Clear error for this field
		if (errors[field]) {
			setErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const renderMappingRow = (field: string, required: boolean = false) => (
		<div key={field} className="mb-4">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{field}
						{required && <span className="text-red-500 ml-1">*</span>}
					</label>
					{mapping[field] && (
						<CheckIcon className="h-4 w-4 text-green-500 ml-2" />
					)}
				</div>
				<span className="text-xs text-gray-500 dark:text-gray-400">
					{FIELD_DESCRIPTIONS[field as keyof typeof FIELD_DESCRIPTIONS]}
				</span>
			</div>
			
			<select
				value={mapping[field] || ''}
				onChange={(e) => handleFieldMapping(field, e.target.value)}
				className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
					errors[field] 
						? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
						: 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
				}`}
			>
				<option value="">Select column...</option>
				{headers.map((header, index) => (
					<option key={index} value={header}>
						{header}
					</option>
				))}
			</select>
			
			{errors[field] && (
				<p className="text-red-500 text-xs mt-1">{errors[field]}</p>
			)}
		</div>
	);

	const mappedCount = Object.values(mapping).filter(Boolean).length;
	const requiredMappedCount = REQUIRED_FIELDS.filter(field => mapping[field]).length;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Map Your Data Columns
							</h2>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								File: <span className="font-medium">{fileName}</span>
							</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							<XMarkIcon className="h-6 w-6" />
						</button>
					</div>
					
					<div className="mt-4 flex items-center gap-4">
						<div className="text-sm text-gray-600 dark:text-gray-400">
							Progress: {requiredMappedCount}/{REQUIRED_FIELDS.length} required fields mapped
						</div>
						<div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
							<div 
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${(requiredMappedCount / REQUIRED_FIELDS.length) * 100}%` }}
							/>
						</div>
					</div>
				</div>

				<div className="p-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Required Fields */}
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
								Required Fields
								<span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
									Required
								</span>
							</h3>
							<div className="space-y-4">
								{REQUIRED_FIELDS.map(field => renderMappingRow(field, true))}
							</div>
						</div>

						{/* Optional Fields */}
						<div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
								Optional Fields
								<span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
									Optional
								</span>
							</h3>
							<div className="space-y-4">
								{OPTIONAL_FIELDS.map(field => renderMappingRow(field, false))}
							</div>
						</div>
					</div>

					{/* Preview section */}
					{mappedCount > 0 && (
						<div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
							<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
								Mapping Preview ({mappedCount} fields mapped)
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
								{Object.entries(mapping)
									.filter(([_, column]) => column)
									.map(([field, column]) => (
										<div key={field} className="flex justify-between items-center">
											<span className="text-gray-600 dark:text-gray-400">{field}:</span>
											<span className="font-medium text-gray-900 dark:text-white">{column}</span>
										</div>
									))
								}
							</div>
						</div>
					)}
				</div>

				<div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
					<div className="flex justify-between items-center">
						<div className="text-sm text-gray-600 dark:text-gray-400">
							<span className="font-medium">{requiredMappedCount}</span> of{" "}
							<span className="font-medium">{REQUIRED_FIELDS.length}</span> required fields mapped
						</div>
						<div className="flex gap-3">
							<button
								onClick={onClose}
								className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirm}
								disabled={requiredMappedCount < REQUIRED_FIELDS.length}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								Continue Analysis
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
