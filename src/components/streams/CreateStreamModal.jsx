// components/streams/CreateStreamModal.jsx
import React, { useState } from 'react';
import useModalDismiss from '../../hooks/useModalDismiss';

const CreateStreamModal = ({ onClose, onSubmit, isPremium = false, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Escape/outside-click dismissal; suppressed while a create request is in
  // flight so an accidental dismiss can't orphan a pending request.
  useModalDismiss(!isSubmitting, onClose);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Stream name is required';
    } else if (!formData.name.match(/^[a-zA-Z0-9_-]+$/)) {
      newErrors.name = 'Only letters, numbers, underscores and hyphens allowed';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Stream name must be less than 100 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div data-modal-root className="bg-dark-card rounded-2xl p-6 border border-white/10 shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-light-text">Create New Stream</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-gray-text hover:text-light-text transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-text mb-2 text-sm">Stream Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border text-light-text focus:ring-2 focus:ring-primary/20 transition ${
                errors.name ? 'border-red-500' : 'border-white/10 focus:border-primary'
              }`}
              placeholder="my-data-stream"
              maxLength={100}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-text mb-2 text-sm">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-3 bg-dark-surface backdrop-blur-xl rounded-lg border border-white/10 text-light-text focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              rows="3"
              placeholder="Describe what this stream will be used for..."
              maxLength={500}
            />
          </div>

          {/* Stream Limits Display */}
          <div className="bg-dark-surface backdrop-blur-xl rounded-lg p-4 border border-white/5">
            <h4 className="text-light-text font-medium mb-2">Stream Limits</h4>
            <div className="text-sm text-gray-text space-y-1">
              <p>• {isPremium ? '100' : '5'} messages/second</p>
              <p>• {isPremium ? '10KB' : '1KB'} max message size</p>
              <p>• {isPremium ? '10,000' : '1,000'} messages retention</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[44px] items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating…' : 'Create Stream'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStreamModal;