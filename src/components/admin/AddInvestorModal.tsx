"use client";

import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { addInvestorAction } from "@/actions/admin.actions";
import { toast } from "@/hooks/use-toast";

interface AddInvestorModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddInvestorModal = ({ onClose, onSuccess }: AddInvestorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await addInvestorAction(formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Investor added successfully.",
        });
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add investor",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6 special-font">Add New Investor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Investor Name</label>
            <input
              name="name"
              required
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500/50 transition-colors"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Investment Firm</label>
            <input
              name="firm"
              required
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500/50 transition-colors"
              placeholder="e.g. Sequoia Capital"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Amount ($)</label>
              <input
                name="amountInvested"
                type="number"
                step="0.01"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500/50 transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ownership (%)</label>
              <input
                name="percentageOwnership"
                type="number"
                step="0.01"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500/50 transition-colors"
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Time Onboarded</label>
            <input
              name="onboardedAt"
              type="datetime-local"
              required
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Add Investor
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddInvestorModal;
