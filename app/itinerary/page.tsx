'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import ExperienceCard from '@/components/ExperienceCard';
import PlanningOptions, { Occasion, Duration, BudgetLevel } from '@/components/PlanningOptions';
import { Plus, Clock, Trash2, Calendar, Map, Download, Edit2, Check, GripVertical } from 'lucide-react';
import { mockExperiences } from '@/lib/mockData';
import { useStore, Itinerary, ItineraryItem } from '@/lib/store';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ItineraryPage() {
  const searchParams = useSearchParams();
  const addExperienceId = searchParams.get('add');
  const { itineraries, addItinerary, updateItinerary, deleteItinerary } = useStore();
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newItineraryName, setNewItineraryName] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isEditingPlanning, setIsEditingPlanning] = useState(false);
  const [planningOccasion, setPlanningOccasion] = useState<Occasion>('general');
  const [planningDuration, setPlanningDuration] = useState<Duration>('full-day');
  const [planningBudget, setPlanningBudget] = useState<BudgetLevel | number>(2);
  const [customBudget, setCustomBudget] = useState<number>(0);

  useEffect(() => {
    if (addExperienceId && !currentItinerary) {
      // Auto-create itinerary if adding experience
      const newItinerary: Itinerary = {
        id: Date.now().toString(),
        name: `My SF Experience - ${format(new Date(), 'MMM d')}`,
        occasion: 'general',
        duration: 'full-day',
        items: [],
        createdAt: new Date().toISOString(),
      };
      setCurrentItinerary(newItinerary);
      addItinerary(newItinerary);
    }
  }, [addExperienceId, currentItinerary, addItinerary]);

  useEffect(() => {
    if (addExperienceId && currentItinerary) {
      const experience = mockExperiences.find((exp) => exp.id === addExperienceId);
      if (experience) {
        addExperienceToItinerary(experience.id);
      }
    }
  }, [addExperienceId, currentItinerary]);

  const createNewItinerary = () => {
    const newItinerary: Itinerary = {
      id: Date.now().toString(),
      name: newItineraryName || `My SF Experience - ${format(new Date(), 'MMM d')}`,
      occasion: planningOccasion,
      duration: planningDuration,
      budget: planningBudget === 'custom' ? `$${customBudget}` : `$${planningBudget}`,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setCurrentItinerary(newItinerary);
    addItinerary(newItinerary);
    setIsCreating(false);
    setNewItineraryName('');
  };

  const updatePlanningOptions = () => {
    if (!currentItinerary) return;
    
    const updated: Itinerary = {
      ...currentItinerary,
      occasion: planningOccasion,
      duration: planningDuration,
      budget: planningBudget === 'custom' ? `$${customBudget}` : `$${planningBudget}`,
    };
    
    setCurrentItinerary(updated);
    updateItinerary(currentItinerary.id, {
      occasion: planningOccasion,
      duration: planningDuration,
      budget: planningBudget === 'custom' ? `$${customBudget}` : `$${planningBudget}`,
    });
    setIsEditingPlanning(false);
  };

  useEffect(() => {
    if (currentItinerary) {
      setPlanningOccasion(currentItinerary.occasion as Occasion || 'general');
      setPlanningDuration(currentItinerary.duration || 'full-day');
      if (currentItinerary.budget) {
        const budgetMatch = currentItinerary.budget.match(/\$(\d+)/);
        if (budgetMatch) {
          setCustomBudget(parseInt(budgetMatch[1]));
          setPlanningBudget('custom');
        } else {
          const budgetLevel = parseInt(currentItinerary.budget.replace('$', ''));
          if (budgetLevel >= 1 && budgetLevel <= 4) {
            setPlanningBudget(budgetLevel as BudgetLevel);
          }
        }
      }
    }
  }, [currentItinerary]);

  const addExperienceToItinerary = (experienceId: string) => {
    if (!currentItinerary) return;

    const experience = mockExperiences.find((exp) => exp.id === experienceId);
    if (!experience) return;

    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      experienceId: experience.id,
      experience,
      startTime: format(new Date(), 'HH:mm'),
      order: currentItinerary.items.length,
    };

    const updated = {
      ...currentItinerary,
      items: [...currentItinerary.items, newItem],
    };

    setCurrentItinerary(updated);
    updateItinerary(currentItinerary.id, { items: updated.items });
  };

  const removeItem = (itemId: string) => {
    if (!currentItinerary) return;

    const updated = {
      ...currentItinerary,
      items: currentItinerary.items.filter((item) => item.id !== itemId),
    };

    setCurrentItinerary(updated);
    updateItinerary(currentItinerary.id, { items: updated.items });
  };

  const updateItemTime = (itemId: string, time: string) => {
    if (!currentItinerary) return;

    const updated = {
      ...currentItinerary,
      items: currentItinerary.items.map((item) =>
        item.id === itemId ? { ...item, startTime: time } : item
      ),
    };

    setCurrentItinerary(updated);
    updateItinerary(currentItinerary.id, { items: updated.items });
  };

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!currentItinerary || !draggedItem) return;

    const draggedIndex = currentItinerary.items.findIndex((item) => item.id === draggedItem);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...currentItinerary.items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, removed);

    // Update order numbers
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    const updated = {
      ...currentItinerary,
      items: reorderedItems,
    };

    setCurrentItinerary(updated);
    updateItinerary(currentItinerary.id, { items: reorderedItems });
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const totalDuration = currentItinerary
    ? currentItinerary.items.reduce((sum, item) => sum + item.experience.duration, 0)
    : 0;

  const estimatedBudget = currentItinerary
    ? currentItinerary.items.reduce((sum, item) => {
        const priceMap: Record<number, number> = { 1: 25, 2: 75, 3: 150, 4: 300 };
        return sum + priceMap[item.experience.priceLevel];
      }, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Itinerary</h1>
          <p className="text-gray-600">Plan your perfect day in San Francisco</p>
        </div>

        {/* Itinerary Selector */}
        {!currentItinerary && !isCreating && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            {itineraries.length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Itineraries</h2>
                  <div className="space-y-2 mb-4">
                    {itineraries.map((itinerary: Itinerary) => (
                      <button
                        key={itinerary.id}
                        onClick={() => setCurrentItinerary(itinerary)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{itinerary.name}</h3>
                            <p className="text-sm text-gray-600">
                              {itinerary.items.length} experience{itinerary.items.length !== 1 ? 's' : ''} • {format(new Date(itinerary.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const idToDelete = itinerary.id;
                              deleteItinerary(idToDelete);
                              if (currentItinerary?.id === idToDelete) {
                                setCurrentItinerary(null);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ) : null}
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Itinerary
            </button>
          </div>
        )}

        {/* Create New Itinerary Form */}
        {isCreating && !currentItinerary && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Itinerary</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Itinerary Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., 'Birthday Weekend in SF'"
                  value={newItineraryName}
                  onChange={(e) => setNewItineraryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <PlanningOptions
                occasion={planningOccasion}
                duration={planningDuration}
                budget={planningBudget}
                customBudget={customBudget}
                onOccasionChange={setPlanningOccasion}
                onDurationChange={setPlanningDuration}
                onBudgetChange={setPlanningBudget}
                onCustomBudgetChange={setCustomBudget}
              />
              
              <div className="flex gap-3">
                <button
                  onClick={createNewItinerary}
                  className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Itinerary
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Itinerary */}
        {currentItinerary && (
          <>
            {/* Itinerary Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{currentItinerary.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(currentItinerary.createdAt), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                    </span>
                    <span>${estimatedBudget.toLocaleString()} estimated</span>
                  </div>
                  
                  {/* Planning Options Summary */}
                  {!isEditingPlanning && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 capitalize">
                        {currentItinerary.occasion?.replace('-', ' ') || 'General'}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary-100 text-secondary-700 capitalize">
                        {currentItinerary.duration?.replace('-', ' ') || 'Full day'}
                      </span>
                      {currentItinerary.budget && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          Budget: {currentItinerary.budget}
                        </span>
                      )}
                      <button
                        onClick={() => setIsEditingPlanning(true)}
                        className="px-3 py-1 text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Planning Options
                      </button>
                    </div>
                  )}

                  {/* Planning Options Editor */}
                  {isEditingPlanning && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <PlanningOptions
                        occasion={planningOccasion}
                        duration={planningDuration}
                        budget={planningBudget}
                        customBudget={customBudget}
                        onOccasionChange={setPlanningOccasion}
                        onDurationChange={setPlanningDuration}
                        onBudgetChange={setPlanningBudget}
                        onCustomBudgetChange={setCustomBudget}
                      />
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={updatePlanningOptions}
                          className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Save Options
                        </button>
                        <button
                          onClick={() => setIsEditingPlanning(false)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/search"
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Link>
                  <button className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {currentItinerary.items.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your itinerary is empty</h3>
                <p className="text-gray-600 mb-6">Start building your perfect day in San Francisco</p>
                <Link
                  href="/search"
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse Experiences
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {currentItinerary.items.map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary-500 transition-all cursor-move ${
                      draggedItem === item.id ? 'opacity-50' : ''
                    } ${
                      dragOverIndex === index ? 'border-l-secondary-500 bg-secondary-50' : ''
                    }`}
                  >
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 flex items-center">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                      </div>
                      
                      <div className="flex-shrink-0 w-24">
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
                          Time
                        </label>
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => updateItemTime(item.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {item.experience.duration} min
                        </p>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.experience.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{item.experience.neighborhood}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{item.experience.description}</p>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>{'$'.repeat(item.experience.priceLevel)}</span>
                          <span>{item.experience.duration} min</span>
                          {item.experience.accessibility && <span>♿ Accessible</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

