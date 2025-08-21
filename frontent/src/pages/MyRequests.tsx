import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Calendar, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

// Sample adoption requests data
const adoptionRequests = [
  {
    id: "req-001",
    petId: "1",
    petName: "Max",
    petBreed: "Golden Retriever",
    petImage: pet1,
    status: "pending",
    submittedDate: "2024-01-18",
    expectedResponseDate: "2024-01-25",
    shelter: "Happy Paws Rescue",
    location: "New York, NY",
    message: "I have a large backyard and previous experience with Golden Retrievers. Looking forward to giving Max a loving home.",
  },
  {
    id: "req-002",
    petId: "2",
    petName: "Luna",
    petBreed: "Tabby Mix",
    petImage: pet2,
    status: "approved",
    submittedDate: "2024-01-10",
    approvedDate: "2024-01-15",
    shelter: "City Cat Sanctuary",
    location: "Los Angeles, CA",
    message: "I live in a quiet apartment and work from home, perfect for a calm cat like Luna.",
    nextSteps: "Please contact the shelter to schedule a meet and greet within 3 days.",
  },
  {
    id: "req-003",
    petId: "5",
    petName: "Buddy",
    petBreed: "Labrador Mix",
    petImage: pet1,
    status: "rejected",
    submittedDate: "2024-01-05",
    rejectedDate: "2024-01-12",
    shelter: "Rescue Heroes",
    location: "Houston, TX",
    message: "Looking for an active companion for hiking and outdoor activities.",
    rejectionReason: "The shelter felt this pet would be better suited for a family with children.",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

const MyRequests = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredRequests = adoptionRequests.filter(request => {
    if (selectedTab === "all") return true;
    return request.status === selectedTab;
  });

  const getStatusCounts = () => {
    return {
      total: adoptionRequests.length,
      pending: adoptionRequests.filter(r => r.status === "pending").length,
      approved: adoptionRequests.filter(r => r.status === "approved").length,
      rejected: adoptionRequests.filter(r => r.status === "rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            My Adoption Requests
          </h1>
          <p className="text-lg text-muted-foreground">
            Track the status of your pet adoption applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pet-warm" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{statusCounts.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{statusCounts.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{statusCounts.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            {filteredRequests.length > 0 ? (
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Pet Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={request.petImage}
                            alt={request.petName}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>

                        {/* Request Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {request.petName}
                              </h3>
                              <p className="text-muted-foreground">{request.petBreed}</p>
                            </div>
                            <Badge 
                              variant={getStatusColor(request.status) as any}
                              className="self-start sm:self-center"
                            >
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              Submitted: {new Date(request.submittedDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {request.shelter}, {request.location}
                            </div>
                          </div>

                          {/* Status-specific information */}
                          {request.status === "pending" && (
                            <div className="bg-muted/30 rounded-lg p-4">
                              <p className="text-sm text-muted-foreground">
                                <strong>Expected response:</strong> {new Date(request.expectedResponseDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {request.status === "approved" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-sm text-green-800">
                                <strong>Approved on:</strong> {new Date(request.approvedDate!).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-green-700 mt-1">
                                <strong>Next steps:</strong> {request.nextSteps}
                              </p>
                            </div>
                          )}

                          {request.status === "rejected" && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-sm text-red-800">
                                <strong>Rejected on:</strong> {new Date(request.rejectedDate!).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                <strong>Reason:</strong> {request.rejectionReason}
                              </p>
                            </div>
                          )}

                          <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                              <strong>Your message:</strong> {request.message}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {request.status === "pending" && (
                            <Button variant="destructive" size="sm">
                              Cancel Request
                            </Button>
                          )}
                          {request.status === "rejected" && (
                            <Button size="sm" className="btn-bounce">
                              Apply Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  No {selectedTab === "all" ? "" : selectedTab} requests found
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  {selectedTab === "all" 
                    ? "You haven't submitted any adoption requests yet. Start browsing pets to find your perfect companion!"
                    : `You don't have any ${selectedTab} requests at the moment.`
                  }
                </p>
                <div className="space-x-4">
                  <Link to="/browse">
                    <Button size="lg" className="btn-bounce">
                      Browse Pets
                    </Button>
                  </Link>
                  <Link to="/favorites">
                    <Button variant="outline" size="lg">
                      View Favorites
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRequests;