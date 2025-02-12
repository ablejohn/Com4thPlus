import React from 'react';
import { Star } from 'react-bootstrap-icons';

const FeaturedProperties = () => {
    return (
        <section id="properties" className="py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-5">
                    <span className="border-bottom border-primary border-3 pb-2">
                        Featured Properties
                    </span>
                </h2>
                <div className="row g-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <img
                                    src="/api/placeholder/400/300"
                                    className="card-img-top"
                                    alt="Property"
                                />
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge bg-primary">Featured</span>
                                        <span style={{ color: "#FFD700" }}>
                                            <Star className="me-1" />
                                            4.9
                                        </span>
                                    </div>
                                    <h5 className="card-title">Luxury Suite in Downtown</h5>
                                    <p className="card-text text-muted">
                                        Modern amenities with stunning city views
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="h5 mb-0" style={{ color: "#003087" }}>
                                            $299<small>/night</small>
                                        </span>
                                        <button className="btn btn-outline-primary">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProperties;